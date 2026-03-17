import { drizzle } from "drizzle-orm/postgres-js"
import { eq } from "drizzle-orm"
import postgres from "postgres"
import * as schema from "../../lib/schema"
import { projects, tasks } from "../../lib/schema"
import { createTestRequest, parseResponse } from "../helpers/request"
import { GET, POST } from "@/app/api/projects/route"
import { GET as GET_BY_ID, PATCH, DELETE } from "@/app/api/projects/[id]/route"

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

beforeEach(async () => {
  await db.delete(tasks)
  await db.delete(projects)
})

afterAll(async () => {
  await db.delete(tasks)
  await db.delete(projects)
  await client.end()
})

// ---------------------------------------------------------------------------
// POST /api/projects
// ---------------------------------------------------------------------------

describe("POST /api/projects", () => {
  it("creates a project with valid data", async () => {
    const req = createTestRequest("/api/projects", {
      method: "POST",
      body: { name: "New Project", description: "A test project" },
    })

    const res = await POST(req)
    const { status, data } = await parseResponse(res)

    expect(status).toBe(201)
    expect(data).toMatchObject({
      name: "New Project",
      description: "A test project",
      status: "active",
    })
    expect(data).toHaveProperty("id")
    expect(data).toHaveProperty("createdAt")
  })

  it("returns 400 when name is missing", async () => {
    const req = createTestRequest("/api/projects", {
      method: "POST",
      body: { description: "No name provided" },
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("returns 409 when name already exists", async () => {
    await db.insert(projects).values({ name: "Duplicate" })

    const req = createTestRequest("/api/projects", {
      method: "POST",
      body: { name: "Duplicate" },
    })

    const res = await POST(req)
    expect(res.status).toBe(409)
  })
})

// ---------------------------------------------------------------------------
// GET /api/projects
// ---------------------------------------------------------------------------

describe("GET /api/projects", () => {
  beforeEach(async () => {
    await db.insert(projects).values([
      { name: "Active One", status: "active" },
      { name: "Active Two", status: "active" },
      { name: "Archived", status: "archived" },
    ])
  })

  it("returns all projects", async () => {
    const req = createTestRequest("/api/projects")
    const res = await GET(req)
    const { status, data } = await parseResponse<any[]>(res)

    expect(status).toBe(200)
    expect(data).toHaveLength(3)
  })

  it("filters by status", async () => {
    const req = createTestRequest("/api/projects", {
      searchParams: { status: "archived" },
    })
    const res = await GET(req)
    const { status, data } = await parseResponse<any[]>(res)

    expect(status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe("Archived")
  })

  it("includes task count for each project", async () => {
    const [activeOne] = await db
      .select()
      .from(projects)
      .where(eq(projects.name, "Active One"))

    await db.insert(tasks).values([
      { title: "Task 1", projectId: activeOne.id },
      { title: "Task 2", projectId: activeOne.id },
    ])

    const req = createTestRequest("/api/projects")
    const res = await GET(req)
    const { data } = await parseResponse<any[]>(res)

    const found = data.find((p: any) => p.name === "Active One")
    expect(found._count?.tasks ?? found.taskCount).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// GET /api/projects/:id
// ---------------------------------------------------------------------------

describe("GET /api/projects/:id", () => {
  it("returns project with task counts by status", async () => {
    const [project] = await db
      .insert(projects)
      .values({ name: "Detail Project" })
      .returning()

    await db.insert(tasks).values([
      { title: "T1", status: "open", projectId: project.id },
      { title: "T2", status: "open", projectId: project.id },
      { title: "T3", status: "in_progress", projectId: project.id },
      { title: "T4", status: "completed", projectId: project.id },
    ])

    const req = createTestRequest(`/api/projects/${project.id}`)
    const res = await GET_BY_ID(req, {
      params: Promise.resolve({ id: project.id }),
    })
    const { status, data } = await parseResponse<any>(res)

    expect(status).toBe(200)
    expect(data.name).toBe("Detail Project")
    expect(data.taskCounts.total).toBe(4)
    expect(data.taskCounts.open).toBe(2)
    expect(data.taskCounts.in_progress).toBe(1)
    expect(data.taskCounts.completed).toBe(1)
  })

  it("returns 404 for non-existent project", async () => {
    const req = createTestRequest(
      "/api/projects/00000000-0000-0000-0000-000000000000"
    )
    const res = await GET_BY_ID(req, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    })

    expect(res.status).toBe(404)
  })
})

// ---------------------------------------------------------------------------
// PATCH /api/projects/:id
// ---------------------------------------------------------------------------

describe("PATCH /api/projects/:id", () => {
  it("updates project fields", async () => {
    const [project] = await db
      .insert(projects)
      .values({ name: "Original" })
      .returning()

    const req = createTestRequest(`/api/projects/${project.id}`, {
      method: "PATCH",
      body: { name: "Updated", description: "Now with description" },
    })
    const res = await PATCH(req, {
      params: Promise.resolve({ id: project.id }),
    })
    const { status, data } = await parseResponse<any>(res)

    expect(status).toBe(200)
    expect(data.name).toBe("Updated")
    expect(data.description).toBe("Now with description")
  })

  it("returns 409 when updating to a duplicate name", async () => {
    await db.insert(projects).values({ name: "Existing" })
    const [project] = await db
      .insert(projects)
      .values({ name: "To Update" })
      .returning()

    const req = createTestRequest(`/api/projects/${project.id}`, {
      method: "PATCH",
      body: { name: "Existing" },
    })
    const res = await PATCH(req, {
      params: Promise.resolve({ id: project.id }),
    })

    expect(res.status).toBe(409)
  })
})

// ---------------------------------------------------------------------------
// DELETE /api/projects/:id
// ---------------------------------------------------------------------------

describe("DELETE /api/projects/:id", () => {
  it("deletes a project with no active tasks", async () => {
    const [project] = await db
      .insert(projects)
      .values({ name: "Deletable" })
      .returning()

    await db.insert(tasks).values({
      title: "Done task",
      status: "completed",
      projectId: project.id,
    })

    const req = createTestRequest(`/api/projects/${project.id}`, {
      method: "DELETE",
    })
    const res = await DELETE(req, {
      params: Promise.resolve({ id: project.id }),
    })

    expect(res.status).toBe(200)

    const found = await db
      .select()
      .from(projects)
      .where(eq(projects.id, project.id))
    expect(found).toHaveLength(0)
  })

  it("returns 409 when project has in_progress tasks", async () => {
    const [project] = await db
      .insert(projects)
      .values({ name: "Active Work" })
      .returning()

    await db.insert(tasks).values({
      title: "WIP",
      status: "in_progress",
      projectId: project.id,
    })

    const req = createTestRequest(`/api/projects/${project.id}`, {
      method: "DELETE",
    })
    const res = await DELETE(req, {
      params: Promise.resolve({ id: project.id }),
    })

    expect(res.status).toBe(409)
  })

  it("returns 404 for non-existent project", async () => {
    const req = createTestRequest(
      "/api/projects/00000000-0000-0000-0000-000000000000",
      { method: "DELETE" }
    )
    const res = await DELETE(req, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    })

    expect(res.status).toBe(404)
  })
})
