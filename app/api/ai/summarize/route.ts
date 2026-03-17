import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ai/summarize
 *
 * Use the LLM to generate a summary of a project's tasks and assess health.
 *
 * Request body:
 *   - projectId (required): string — UUID of the project to summarize
 *
 * Response shape:
 *   {
 *     project: { id, name },
 *     summary: { summary: string, taskCount: number, health: "on_track" | "needs_attention" | "completed" }
 *   }
 *
 * Error handling:
 *   - 400 if projectId is missing
 *   - 404 if project not found
 *   - 503 if LLM service is unreachable
 *   - 502 if LLM response cannot be parsed as JSON
 *
 * Implementation steps:
 *   1. Validate projectId is present
 *   2. Fetch the project with its tasks using `db.query.projects.findFirst({ with: { tasks: true } })`
 *   3. Build a user message listing each task with status and priority
 *   4. Call chatCompletion with a system prompt containing "summarize" or "summary"
 *   5. Parse the JSON response
 *   6. Return project info and summary
 *
 * Hints:
 *   - Format each task as: `- ${title} [status: ${status}, priority: ${priority}]`
 *   - Handle empty task list: send "This project has no tasks yet."
 *   - The mock LLM returns { summary, taskCount, health } when triggered by "summarize"
 */
export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: "POST /api/ai/summarize not implemented" },
    { status: 501 },
  );
}
