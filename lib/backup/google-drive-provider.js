/**
 * Jaipur Stonecraft — Off-Site Google Drive Backup Sync Engine
 * 
 * Interacts with Google Drive v3 REST API using Node's native crypto module and fetch.
 * Authenticates via Service Account JWT assertion (RSA-SHA256).
 * Handles off-site cloud uploads, metadata queries, and automated cloud backup retention pruning.
 * Falls back safely to local disk storage if Google Drive environment credentials are not set.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Generate OAuth2 Access Token from Google Service Account credentials via JWT RSA-SHA256 Assertion
 */
async function getGoogleDriveAccessToken() {
  const serviceAccountEmail = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (!serviceAccountEmail || !privateKey) {
    return null;
  }

  // Replace escaped newlines in private key
  privateKey = privateKey.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/drive.file",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const unsignedJwt = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  const signature = signer.sign(privateKey, "base64");
  const encodedSignature = signature
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${unsignedJwt}.${encodedSignature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Failed to obtain Google Drive OAuth token: ${errText}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

export async function uploadFileToGoogleDrive(filePath, options = {}) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  try {
    const accessToken = await getGoogleDriveAccessToken();
    if (!accessToken) {
      return {
        synced: false,
        reason: "GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL or GOOGLE_DRIVE_PRIVATE_KEY not set in environment"
      };
    }

    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = fileName.endsWith(".sql") ? "text/plain" : "application/json";

    const metadata = {
      name: fileName,
      mimeType
    };

    if (folderId) {
      metadata.parents = [folderId];
    }

    const boundary = "-------314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody = Buffer.concat([
      Buffer.from(`${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`),
      Buffer.from(`${delimiter}Content-Type: ${mimeType}\r\n\r\n`),
      fileBuffer,
      Buffer.from(closeDelimiter)
    ]);

    const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Google Drive API Upload Error: ${errText}`);
    }

    const fileData = await uploadRes.json();
    return {
      synced: true,
      fileId: fileData.id,
      fileName: fileData.name
    };
  } catch (error) {
    console.warn(`[Google Drive Provider Warning]: ${error.message}`);
    return {
      synced: false,
      reason: error.message
    };
  }
}

export async function pruneRemoteGoogleDriveBackups(retentionCount = 14) {
  try {
    const accessToken = await getGoogleDriveAccessToken();
    if (!accessToken) return { prunedCount: 0 };

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    let queryStr = "trashed = false";
    if (folderId) {
      queryStr += ` and '${folderId}' in parents`;
    }

    const listRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryStr)}&orderBy=createdTime desc&fields=files(id,name,createdTime)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!listRes.ok) return { prunedCount: 0 };

    const data = await listRes.json();
    const files = data.files || [];

    if (files.length > retentionCount) {
      const filesToDelete = files.slice(retentionCount);
      let prunedCount = 0;

      for (const f of filesToDelete) {
        const delRes = await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (delRes.ok) prunedCount++;
      }

      return { prunedCount };
    }

    return { prunedCount: 0 };
  } catch (e) {
    return { prunedCount: 0, error: e.message };
  }
}
