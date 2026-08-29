/**
 * Jaipur Stonecraft — Backblaze B2 S3-Compatible Cloud Storage Client
 * 
 * Provides an enterprise, provider-agnostic storage abstraction for production media.
 * Uses Backblaze B2 S3-compatible API over enforced TLS (HTTPS).
 * Reads all credentials exclusively from environment variables with zero secret exposure.
 */

import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand
} from "@aws-sdk/client-s3";

let s3ClientInstance = null;

/**
 * Get S3 Client configured for Backblaze B2
 */
export function getB2Client() {
  if (s3ClientInstance) return s3ClientInstance;

  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY;
  const endpoint = process.env.B2_ENDPOINT;

  if (!keyId || !applicationKey || !endpoint) {
    const missing = [];
    if (!keyId) missing.push("B2_KEY_ID");
    if (!applicationKey) missing.push("B2_APPLICATION_KEY");
    if (!endpoint) missing.push("B2_ENDPOINT");
    throw new Error(`[B2 Client Error]: Missing required environment variables: ${missing.join(", ")}`);
  }

  // Ensure endpoint has protocol
  const formattedEndpoint = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `https://${endpoint}`;

  // Extract region from endpoint (e.g. s3.us-east-005.backblazeb2.com -> us-east-005)
  const regionMatch = endpoint.match(/s3\.([a-z0-9-]+)\.backblazeb2\.com/i);
  const region = regionMatch ? regionMatch[1] : "us-east-005";

  s3ClientInstance = new S3Client({
    endpoint: formattedEndpoint,
    region,
    credentials: {
      accessKeyId: keyId,
      secretAccessKey: applicationKey
    },
    forcePathStyle: true,
    tls: true
  });

  return s3ClientInstance;
}

/**
 * Resolve full public URL for a given relative object key
 */
export function getPublicUrl(key) {
  if (!key) return "";
  const cleanKey = key.replace(/^\/+/, "");
  
  const publicBaseUrl = process.env.B2_PUBLIC_URL || process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  if (publicBaseUrl) {
    const base = publicBaseUrl.replace(/\/+$/, "");
    return `${base}/${cleanKey}`;
  }

  const bucket = process.env.B2_BUCKET_NAME || "";
  const endpoint = (process.env.B2_ENDPOINT || "s3.us-east-005.backblazeb2.com").replace(/^https?:\/\//, "");
  
  return `https://${bucket}.${endpoint}/${cleanKey}`;
}

/**
 * Upload a Buffer or Stream to Backblaze B2
 */
export async function uploadObject({ key, body, contentType, cacheControl, metadata = {} }) {
  const client = getB2Client();
  const bucket = process.env.B2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("[B2 Client Error]: B2_BUCKET_NAME environment variable is missing.");
  }

  const cleanKey = key.replace(/^\/+/, "");

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
    Body: body,
    ContentType: contentType || "application/octet-stream",
    CacheControl: cacheControl || "public, max-age=31536000, immutable",
    Metadata: metadata
  });

  const response = await client.send(command);
  const publicUrl = getPublicUrl(cleanKey);

  return {
    success: true,
    key: cleanKey,
    eTag: response.ETag ? response.ETag.replace(/"/g, "") : null,
    publicUrl
  };
}

/**
 * Check if an object exists in Backblaze B2
 */
export async function checkObjectExists(key) {
  const client = getB2Client();
  const bucket = process.env.B2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("[B2 Client Error]: B2_BUCKET_NAME environment variable is missing.");
  }

  const cleanKey = key.replace(/^\/+/, "");

  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: cleanKey
    });
    const response = await client.send(command);
    return {
      exists: true,
      contentLength: response.ContentLength,
      contentType: response.ContentType,
      eTag: response.ETag ? response.ETag.replace(/"/g, "") : null,
      lastModified: response.LastModified
    };
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return { exists: false };
    }
    throw error;
  }
}

/**
 * Delete an object from Backblaze B2
 */
export async function deleteObject(key) {
  const client = getB2Client();
  const bucket = process.env.B2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("[B2 Client Error]: B2_BUCKET_NAME environment variable is missing.");
  }

  const cleanKey = key.replace(/^\/+/, "");

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: cleanKey
  });

  await client.send(command);

  return {
    success: true,
    key: cleanKey
  };
}

/**
 * List objects in Backblaze B2 under a given prefix
 */
export async function listObjects({ prefix = "", maxKeys = 1000, continuationToken } = {}) {
  const client = getB2Client();
  const bucket = process.env.B2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("[B2 Client Error]: B2_BUCKET_NAME environment variable is missing.");
  }

  const cleanPrefix = prefix ? prefix.replace(/^\/+/, "") : "";

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: cleanPrefix,
    MaxKeys: maxKeys,
    ContinuationToken: continuationToken
  });

  const response = await client.send(command);

  const objects = (response.Contents || []).map(item => ({
    key: item.Key,
    size: item.Size,
    eTag: item.ETag ? item.ETag.replace(/"/g, "") : null,
    lastModified: item.LastModified
  }));

  return {
    objects,
    keyCount: response.KeyCount || objects.length,
    isTruncated: response.IsTruncated || false,
    nextContinuationToken: response.NextContinuationToken || null
  };
}

/**
 * Isolated Connectivity & Permission Test
 * Performs harmless HeadBucket and a temporary test object write/delete in `_connectivity_test/`
 */
export async function testB2Connection() {
  const bucket = process.env.B2_BUCKET_NAME;
  const endpoint = process.env.B2_ENDPOINT;

  const client = getB2Client();

  // 1. Test Bucket Accessibility
  await client.send(new HeadBucketCommand({ Bucket: bucket }));

  // 2. Perform Isolated Write & Delete Test in `_connectivity_test/`
  const testKey = `_connectivity_test/test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.txt`;
  const testPayload = Buffer.from("Jaipur Stonecraft B2 Connectivity Verification", "utf8");

  // Write test object
  const uploadRes = await uploadObject({
    key: testKey,
    body: testPayload,
    contentType: "text/plain"
  });

  // Verify existence
  const existsRes = await checkObjectExists(testKey);

  // Delete test object immediately
  await deleteObject(testKey);

  return {
    connected: true,
    bucket,
    endpoint,
    testKey,
    eTag: uploadRes.eTag,
    verifiedAndCleaned: existsRes.exists === true
  };
}
