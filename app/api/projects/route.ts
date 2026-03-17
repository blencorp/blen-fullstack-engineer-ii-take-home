import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/projects
 *
 * List all projects with optional status filter.
 * Each project includes a taskCount field.
 *
 * Query params:
 *   - status (optional): "active" | "completed" | "archived"
 *
 * Response: Array of projects, each with a `taskCount` number field.
 *
 * Hints:
 *   - Use a subquery or left join to count tasks per project
 *   - Use `sql<number>` with `coalesce` for null-safe counts
 *   - Filter by status using Drizzle's `eq()` when the param is present
 */
export async function GET(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: "GET /api/projects not implemented" },
    { status: 501 },
  );
}

/**
 * POST /api/projects
 *
 * Create a new project.
 *
 * Request body:
 *   - name (required): string — must be unique
 *   - description (optional): string
 *
 * Response: 201 with the created project
 *
 * Error handling:
 *   - 400 if name is missing or empty
 *   - 409 if a project with this name already exists
 *
 * Hints:
 *   - Check for unique constraint violations (code 23505 or "unique"/"duplicate" in message)
 *   - Trim the name before inserting
 */
export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: "POST /api/projects not implemented" },
    { status: 501 },
  );
}
