/**
 * Jaipur Stonecraft — Enterprise Google Drive Backup & Deduplication Engine (Phase 5C)
 * 
 * Supports:
 *   1. Google Service Account (JWT RSA-SHA256 assertion - headless/recommended).
 *   2. OAuth2 Refresh Token (Client ID + Client Secret + Refresh Token).
 *   3. Remote Directory Hierarchy: 'Jaipur Stonecraft Backups/' -> Database & Images.
 *   4. Remote Deduplication: Skips uploading existing objects if already present in Drive.
 *   5. Read-Back Verification: Proves remote backup accessibility non-destructively.
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

let folderCache = new Map();

/**
 * Obtain Google Drive OAuth2 Access Token
 */
export async function getGoogleDriveAccessToken() {
  // Method A: Service Account via JSON key file or env vars
  const serviceAccountEmail = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;
  const keyFilePath = process.env.GOOGLE_DRIVE_KEY_FILE;

  if (keyFilePath && fs.existsSync(keyFilePath)) {
    try {
      const keyJson = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
      return await getServiceAccountToken(keyJson.client_email, keyJson.private_key);
    } catch (e) {
      console.warn(`[Google Drive Auth Warning]: Failed to read key file ${keyFilePath}: ${e.message}`);
    }
  }

  if (serviceAccountEmail && privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
    return await getServiceAccountToken(serviceAccountEmail, privateKey);
  }

  // Method B: OAuth2 User Refresh Token
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    return await getOAuth2RefreshToken(clientId, clientSecret, refreshToken);
  }

  return null;
}

async function getServiceAccountToken(email, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: email,
    scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive",
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
    throw new Error(`Google Service Account Token Error: ${errText}`);
  }

  const data = await tokenRes.json();
  return data.access_token;
}

async function getOAuth2RefreshToken(clientId, clientSecret, refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google OAuth2 Refresh Token Error: ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Get or create folder hierarchy on Google Drive
 */
export async function ensureDriveFolder(accessToken, folderPath) {
  if (folderCache.has(folderPath)) {
    return folderCache.get(folderPath);
  }

  const segments = folderPath.split("/").filter(Boolean);
  let parentId = process.env.GOOGLE_DRIVE_FOLDER_ID || "root";

  for (const seg of segments) {
    const queryStr = `mimeType = 'application/vnd.google-apps.folder' and name = '${seg}' and '${parentId}' in parents and trashed = false`;
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryStr)}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!searchRes.ok) {
      throw new Error(`Failed to query folder '${seg}': ${await searchRes.text()}`);
    }

    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      parentId = data.files[0].id;
    } else {
      // Create folder
      const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: seg,
          mimeType: "application/vnd.google-apps.folder",
          parents: [parentId]
        })
      });

      if (!createRes.ok) {
        throw new Error(`Failed to create folder '${seg}': ${await createRes.text()}`);
      }

      const newFolder = await createRes.json();
      parentId = newFolder.id;
    }
  }

  folderCache.set(folderPath, parentId);
  return parentId;
}

/**
 * Upload single file to Google Drive with Deduplication
 */
export async function uploadFileToGoogleDrive(filePath, options = {}) {
  try {
    const accessToken = await getGoogleDriveAccessToken();
    if (!accessToken) {
      return {
        synced: false,
        reason: "Google Drive credentials not set in environment"
      };
    }

    const fileName = path.basename(filePath);
    const subfolder = options.subfolder || "General";
    const fullFolderPath = `Jaipur Stonecraft Backups/${subfolder}`;
    const targetFolderId = await ensureDriveFolder(accessToken, fullFolderPath);

    // Remote Deduplication Check: Check if file already exists in target folder
    const checkQuery = `name = '${fileName}' and '${targetFolderId}' in parents and trashed = false`;
    const checkRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(checkQuery)}&fields=files(id,name,size,createdTime)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (existing.files && existing.files.length > 0) {
        return {
          synced: true,
          skippedDuplicate: true,
          fileId: existing.files[0].id,
          fileName,
          folder: fullFolderPath
        };
      }
    }

    // Prepare upload
    const fileBuffer = fs.readFileSync(filePath);
    let mimeType = "application/octet-stream";
    if (fileName.endsWith(".json")) mimeType = "application/json";
    if (fileName.endsWith(".sql")) mimeType = "text/plain";
    if (fileName.endsWith(".gz")) mimeType = "application/gzip";
    if (fileName.endsWith(".webp")) mimeType = "image/webp";
    if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) mimeType = "image/jpeg";
    if (fileName.endsWith(".png")) mimeType = "image/png";

    const metadata = {
      name: fileName,
      mimeType,
      parents: [targetFolderId]
    };

    const boundary = "-------" + crypto.randomBytes(16).toString("hex");
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartBody = Buffer.concat([
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
      body: multipartBody
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Upload failed: ${errText}`);
    }

    const uploadedData = await uploadRes.json();
    return {
      synced: true,
      skippedDuplicate: false,
      fileId: uploadedData.id,
      fileName: uploadedData.name,
      folder: fullFolderPath
    };
  } catch (error) {
    console.warn(`[Google Drive Warning]: ${error.message}`);
    return {
      synced: false,
      reason: error.message
    };
  }
}

/**
 * Test & verify reading remote Google Drive files
 */
export async function verifyRemoteGoogleDriveUploads() {
  const accessToken = await getGoogleDriveAccessToken();
  if (!accessToken) {
    return {
      connected: false,
      reason: "Credentials not configured"
    };
  }

  try {
    const listRes = await fetch("https://www.googleapis.com/drive/v3/files?q=trashed = false&pageSize=20&fields=files(id,name,mimeType,size,createdTime)&orderBy=createdTime desc", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!listRes.ok) {
      return { connected: false, reason: await listRes.text() };
    }

    const data = await listRes.json();
    return {
      connected: true,
      recentFilesCount: (data.files || []).length,
      files: (data.files || []).map(f => ({
        name: f.name,
        size: f.size,
        createdTime: f.createdTime
      }))
    };
  } catch (e) {
    return { connected: false, reason: e.message };
  }
}

export async function pruneRemoteGoogleDriveBackups(retentionCount = 14) {
  try {
    const accessToken = await getGoogleDriveAccessToken();
    if (!accessToken) return { prunedCount: 0 };

    const queryStr = "trashed = false and mimeType != 'application/vnd.google-apps.folder'";
    const listRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(queryStr)}&orderBy=createdTime desc&fields=files(id,name,createdTime)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!listRes.ok) return { prunedCount: 0 };
    const data = await listRes.json();
    const files = data.files || [];

    if (files.length > retentionCount) {
      const toDelete = files.slice(retentionCount);
      let count = 0;
      for (const f of toDelete) {
        const del = await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (del.ok) count++;
      }
      return { prunedCount: count };
    }
    return { prunedCount: 0 };
  } catch (e) {
    return { prunedCount: 0, error: e.message };
  }
}
