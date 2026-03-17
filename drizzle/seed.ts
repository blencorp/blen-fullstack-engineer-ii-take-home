import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { projects, tasks } from "../lib/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await db.delete(tasks);
  await db.delete(projects);

  // Seed projects
  const [projectAlpha] = await db
    .insert(projects)
    .values({
      name: "Project Alpha",
      description: "Main product development",
      status: "active",
    })
    .returning();

  const [projectBeta] = await db
    .insert(projects)
    .values({
      name: "Project Beta",
      description: "Internal tooling",
      status: "active",
    })
    .returning();

  await db.insert(projects).values({
    name: "Legacy Migration",
    description: "Migrate legacy services to new architecture",
    status: "archived",
  });

  // Seed tasks for Project Alpha
  await db.insert(tasks).values([
    {
      title: "Set up CI/CD pipeline",
      description:
        "Configure GitHub Actions for automated testing and deployment",
      status: "completed",
      priority: "high",
      assignee: "alice",
      projectId: projectAlpha.id,
    },
    {
      title: "Implement user authentication",
      description: "Add JWT-based auth with refresh tokens",
      status: "in_progress",
      priority: "critical",
      assignee: "bob",
      projectId: projectAlpha.id,
    },
    {
      title: "Design database schema",
      description: "Create ERD and implement migrations",
      status: "in_review",
      priority: "high",
      projectId: projectAlpha.id,
    },
    {
      title: "Write API documentation",
      description: "Document all REST endpoints with OpenAPI spec",
      status: "open",
      priority: "medium",
      projectId: projectAlpha.id,
    },
    {
      title: "Add error monitoring",
      description: "Integrate Sentry for error tracking",
      status: "open",
      priority: "low",
      projectId: projectAlpha.id,
    },
  ]);

  // Seed tasks for Project Beta
  await db.insert(tasks).values([
    {
      title: "Build admin dashboard",
      description: "Create internal admin panel for user management",
      status: "open",
      priority: "medium",
      assignee: "charlie",
      projectId: projectBeta.id,
    },
    {
      title: "Set up logging infrastructure",
      description: "Configure centralized logging with ELK stack",
      status: "open",
      priority: "high",
      projectId: projectBeta.id,
    },
  ]);

  console.log("Database seeded successfully.");
  await client.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
