import { NextRequest, NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

/**
 * GET /api/projects/:id
 *
 * Get a single project by ID, including its tasks and taskCounts by status.
 *
 * Response shape:
 *   {
 *     id, name, description, status, createdAt, updatedAt,
 *     tasks: Task[],
 *     taskCounts: { total, open, in_progress, in_review, completed }
 *   }
 *
 * Error handling:
 *   - 404 if project not found
 *
 * Hints:
 *   - Use `db.query.projects.findFirst` with `{ with: { tasks: true } }`
 *   - Compute taskCounts by filtering the tasks array in memory
 */
export async function GET(request: NextRequest, context: RouteContext) {
  void request
  void context
  return NextResponse.json(
    { error: "GET /api/projects/:id not implemented" },
    { status: 501 }
  )
}

/**
 * PATCH /api/projects/:id
 *
 * Update a project's name, description, or status.
 *
 * Request body (all optional):
 *   - name: string
 *   - description: string
 *   - status: "active" | "completed" | "archived"
 *
 * Error handling:
 *   - 404 if project not found
 *   - 409 if updating name to one that already exists
 *
 * Hints:
 *   - Always set updatedAt to new Date()
 *   - Check for unique constraint violations on name
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  void request
  void context
  return NextResponse.json(
    { error: "PATCH /api/projects/:id not implemented" },
    { status: 501 }
  )
}

/**
 * DELETE /api/projects/:id
 *
 * Delete a project. Blocked if tasks are in_progress or in_review.
 *
 * Error handling:
 *   - 404 if project not found
 *   - 409 if project has tasks in "in_progress" or "in_review" status
 *
 * Hints:
 *   - Count active tasks using `inArray(tasks.status, ["in_progress", "in_review"])`
 *   - Return 200 with success message on deletion
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  void request
  void context
  return NextResponse.json(
    { error: "DELETE /api/projects/:id not implemented" },
    { status: 501 }
  )
}
