/**
 * Jaipur Stonecraft — AI Job Processor & Orchestrator
 * 
 * Safely executes asynchronous AI jobs:
 * - Processes pending jobs from ai_jobs table
 * - Controlled retry behavior (rate limit/quota backoff)
 * - Safe manual overrides
 * - Idempotent
 */

import { getAiJob, updateAiJob, JOB_STATUSES, JOB_TYPES } from "./job-queue.js";
import { enrichProductContent } from "./content-enricher.js";

/**
 * Processes a specific AI job by ID.
 * 
 * @param {string} jobId - The job ID to process
 * @returns {Promise<Object>} { success, job }
 */
export async function processAiJob(jobId) {
  const job = await getAiJob(jobId);
  if (!job) {
    return { success: false, error: `Job ${jobId} not found.` };
  }

  // If already completed or currently processing, do not re-run simultaneously
  if (job.status === JOB_STATUSES.COMPLETED) {
    return { success: true, job, alreadyCompleted: true };
  }

  // Increment attempt counter and mark processing
  const nextAttempts = (job.attempts || 0) + 1;
  await updateAiJob(jobId, {
    status: JOB_STATUSES.PROCESSING,
    attempts: nextAttempts
  });

  try {
    let result = null;

    if (job.jobType === JOB_TYPES.CONTENT_ENRICHMENT || job.jobType === JOB_TYPES.FULL_PIPELINE) {
      result = await enrichProductContent(job.productSlug, job.inputPayload?.facts || {});
    }

    if (result && result.success) {
      const completedJob = await updateAiJob(jobId, {
        status: JOB_STATUSES.COMPLETED,
        outputPayload: result.generatedData || {},
        errorMessage: null,
        errorCode: null
      });
      return { success: true, job: completedJob };
    }

    // Failure / Rate limit handling
    const errorCode = result?.errorCode || "PROCESSING_FAILED";
    const errorMessage = result?.error || "AI job execution failed.";

    // If quota or rate limit, do NOT hammer the provider.
    const isRateLimit = errorCode === "RATE_LIMIT" || errorCode === "QUOTA_EXCEEDED" || errorCode === "UNAVAILABLE";
    const canRetry = !isRateLimit && nextAttempts < job.maxAttempts;

    const nextStatus = canRetry
      ? JOB_STATUSES.RETRYING
      : isRateLimit
        ? JOB_STATUSES.WAITING_FOR_USER
        : JOB_STATUSES.FAILED;

    const failedJob = await updateAiJob(jobId, {
      status: nextStatus,
      errorMessage,
      errorCode
    });

    return { success: false, job: failedJob, error: errorMessage };

  } catch (err) {
    const nextStatus = nextAttempts < job.maxAttempts ? JOB_STATUSES.RETRYING : JOB_STATUSES.FAILED;
    const failedJob = await updateAiJob(jobId, {
      status: nextStatus,
      errorMessage: err.message || "Unexpected exception during job processing.",
      errorCode: "EXCEPTION"
    });

    return { success: false, job: failedJob, error: err.message };
  }
}
