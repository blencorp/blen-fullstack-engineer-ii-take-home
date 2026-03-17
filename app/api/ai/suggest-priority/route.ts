import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ai/suggest-priority
 *
 * Use the LLM to suggest a priority level for a task based on its description.
 * This is advisory only — it does not modify any task in the database.
 *
 * Request body:
 *   - title (required): string — the task title
 *   - description (optional): string — additional context
 *
 * Response shape:
 *   { suggestion: { priority: "critical" | "high" | "medium" | "low", reasoning: string } }
 *
 * Error handling:
 *   - 400 if title is missing or empty
 *   - 503 if LLM service is unreachable
 *   - 502 if LLM response cannot be parsed as JSON
 *
 * Implementation steps:
 *   1. Validate title is present and non-empty
 *   2. Call chatCompletion with a system prompt containing "priority" or "urgency"
 *      and the title + description as user content
 *   3. Parse the JSON response
 *   4. Return the suggestion
 *
 * Hints:
 *   - Combine title and description: `${title}${description ? "\n" + description : ""}`
 *   - The mock LLM triggers priority suggestion when the system prompt contains
 *     "priority" or "urgency"
 *   - The mock LLM returns { priority, reasoning }
 */
export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: "POST /api/ai/suggest-priority not implemented" },
    { status: 501 },
  );
}
