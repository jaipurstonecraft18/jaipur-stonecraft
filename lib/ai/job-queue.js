/**
 * Jaipur Stonecraft — Database-Backed AI Job Queue
 * 
 * Persistent, robust job queue system for asynchronous AI tasks:
 * - Vision Fact Extraction (Gemini)
 * - Content & SEO Enrichment (Grok)
 * 
 * States: 'pending' | 'processing' | 'completed' | 'retrying' | 'failed' | 'waiting_for_user'
 * Idempotent, retryable, server-side only.
 */

import crypto from "crypto";
import { query, getOne, execute } from "../db/client.js";

export const JOB_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  RETRYING: "retrying",
  FAILED: "failed",
  WAITING_FOR_USER: "waiting_for_user"
};

export const JOB_TYPES = {
  VISION_ANALYSIS: "vision_analysis",
  CONTENT_ENRICHMENT: "content_enrichment",
  FULL_PIPELINE: "full_pipeline"
};

/**
 * Creates and persists a new AI job in the database.
 */
export async function createAiJob({
  productSlug,
  jobType = JOB_TYPES.CONTENT_ENRICHMENT,
  provider = "grok",
  inputPayload = {},
  maxAttempts = 3
}) {
  const jobId = `job_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  
  await execute(`
    INSERT INTO ai_jobs (
      id, product_slug, job_type, provider, status, attempts, max_attempts,
      input_payload, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())
  `, [
    jobId,
    productSlug,
    jobType,
    provider,
    JOB_STATUSES.PENDING,
    maxAttempts,
    JSON.stringify(inputPayload || {})
  ]);

  return getAiJob(jobId);
}

/**
 * Retrieves a single AI job by ID.
 */
export async function getAiJob(jobId) {
  const row = await getOne("SELECT * FROM ai_jobs WHERE id = ?", [jobId]);
  if (!row) return null;
  return formatJobRow(row);
}

/**
 * Retrieves all AI jobs for a specific product.
 */
export async function getAiJobsForProduct(productSlug) {
  const rows = await query(
    "SELECT * FROM ai_jobs WHERE product_slug = ? ORDER BY created_at DESC",
    [productSlug]
  );
  return rows.map(formatJobRow);
}

/**
 * Retrieves active / pending jobs that need execution.
 */
export async function getPendingAiJobs(limit = 10) {
  const rows = await query(
    `SELECT * FROM ai_jobs 
     WHERE status IN (?, ?) AND attempts < max_attempts 
     ORDER BY created_at ASC LIMIT ?`,
    [JOB_STATUSES.PENDING, JOB_STATUSES.RETRYING, limit]
  );
  return rows.map(formatJobRow);
}

/**
 * Updates status, payloads, or error information for an AI job.
 */
export async function updateAiJob(jobId, updates = {}) {
  const existing = await getAiJob(jobId);
  if (!existing) {
    throw new Error(`AI Job with ID ${jobId} not found.`);
  }

  const fields = [];
  const params = [];

  if (updates.status !== undefined) {
    fields.push("status = ?");
    params.push(updates.status);
  }
  if (updates.attempts !== undefined) {
    fields.push("attempts = ?");
    params.push(updates.attempts);
  }
  if (updates.outputPayload !== undefined) {
    fields.push("output_payload = ?");
    params.push(typeof updates.outputPayload === "string" ? updates.outputPayload : JSON.stringify(updates.outputPayload));
  }
  if (updates.inputPayload !== undefined) {
    fields.push("input_payload = ?");
    params.push(typeof updates.inputPayload === "string" ? updates.inputPayload : JSON.stringify(updates.inputPayload));
  }
  if (updates.errorMessage !== undefined) {
    fields.push("error_message = ?");
    params.push(updates.errorMessage);
  }
  if (updates.errorCode !== undefined) {
    fields.push("error_code = ?");
    params.push(updates.errorCode);
  }

  if (fields.length === 0) return existing;

  params.push(jobId);
  await execute(`UPDATE ai_jobs SET ${fields.join(", ")} WHERE id = ?`, params);

  return getAiJob(jobId);
}

/**
 * Normalizes raw SQL row to standard JS job object.
 */
function formatJobRow(row) {
  let inputPayload = {};
  let outputPayload = null;

  try {
    inputPayload = typeof row.input_payload === "string" ? JSON.parse(row.input_payload || "{}") : (row.input_payload || {});
  } catch { inputPayload = {}; }

  try {
    outputPayload = typeof row.output_payload === "string" ? JSON.parse(row.output_payload || "null") : row.output_payload;
  } catch { outputPayload = null; }

  return {
    id: row.id,
    productSlug: row.product_slug,
    jobType: row.job_type,
    provider: row.provider,
    status: row.status,
    attempts: row.attempts,
    maxAttempts: row.max_attempts,
    inputPayload,
    outputPayload,
    errorMessage: row.error_message,
    errorCode: row.error_code,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
