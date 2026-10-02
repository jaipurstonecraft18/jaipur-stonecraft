import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import {
  createAiJob,
  getAiJob,
  getAiJobsForProduct,
  JOB_TYPES
} from "@/lib/ai/job-queue.js";
import { processAiJob } from "@/lib/ai/job-processor.js";

/**
 * GET /api/admin/ai/jobs?productSlug=...&jobId=...
 * Query AI job status.
 */
export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const productSlug = searchParams.get("productSlug");

  if (jobId) {
    const job = await getAiJob(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json({ success: true, job });
  }

  if (productSlug) {
    const jobs = await getAiJobsForProduct(productSlug);
    return NextResponse.json({ success: true, jobs });
  }

  return NextResponse.json({ error: "Provide jobId or productSlug" }, { status: 400 });
}

/**
 * POST /api/admin/ai/jobs
 * Queue a new background AI job or retry an existing one.
 */
export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = body.action || "queue";

    if (action === "retry") {
      const { jobId } = body;
      if (!jobId) return NextResponse.json({ error: "jobId is required for retry" }, { status: 400 });

      // Run processor in background (non-blocking)
      const promise = processAiJob(jobId).catch(err => console.error("[AI Job Background Error]:", err));

      return NextResponse.json({ success: true, message: "Job retry queued." });
    }

    // Default: queue new background enrichment job
    const productSlug = body.productSlug;
    if (!productSlug) {
      return NextResponse.json({ error: "productSlug is required" }, { status: 400 });
    }

    const job = await createAiJob({
      productSlug,
      jobType: body.jobType || JOB_TYPES.CONTENT_ENRICHMENT,
      provider: body.provider || "grok",
      inputPayload: {
        facts: body.facts || {},
        product: body.product || null
      }
    });

    // Execute processor asynchronously in background (don't make user wait!)
    processAiJob(job.id).catch(err => {
      console.error("[Async AI Background Job Error]:", err);
    });

    return NextResponse.json({
      success: true,
      message: "AI enrichment job queued successfully in background.",
      job
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message || "Failed to process AI job request."
    }, { status: 500 });
  }
}
