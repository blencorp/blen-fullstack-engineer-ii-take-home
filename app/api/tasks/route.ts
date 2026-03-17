import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/tasks
 *
 * List tasks with filtering and pagination.
 *
 * Query params:
 *   - projectId (optional): filter by project
 *   - status (optional): "open" | "in_progress" | "in_review" | "completed"
 *   - priority (optional): "low" | "medium" | "high" | "critical"
 *   - assignee (optional): filter by assignee name
 *   - page (optional, default 1): page number
 *   - pageSize (optional, default 10, max 50): items per page
 *
 * Response shape (PaginatedResponse):
 *   {
 *     data: Task[],
 *     pagination: { page, pageSize, total, totalPages }
 *   }
 *
 * Hints:
 *   - Build conditions array with `SQL[]` and combine using `and(...conditions)`
 *   - Use separate queries for count and data (with limit/offset)
 */
export async function GET(request: NextRequest) {
  void request
  return NextResponse.json(
    { error: "GET /api/tasks not implemented" },
    { status: 501 }
  )
}

/**
 * POST /api/tasks
 *
 * Create a new task.
 *
 * Request body:
 *   - title (required): string
 *   - projectId (required): string — must reference an existing project
 *   - description (optional): string
 *   - priority (optional): "low" | "medium" | "high" | "critical"
 *   - assignee (optional): string
 *   - dueDate (optional): ISO date string
 *   - labels (optional): string[]
 *
 * Response: 201 with the created task
 *
 * Error handling:
 *   - 400 if title is missing or empty
 *   - 400 if projectId is missing
 *   - 400 if projectId references a non-existent project
 *
 * Hints:
 *   - Verify project exists before inserting
 *   - Defaults: status="open", priority="medium"
 */
export async function POST(request: NextRequest) {
  void request
  return NextResponse.json(
    { error: "POST /api/tasks not implemented" },
    { status: 501 }
  )
}
