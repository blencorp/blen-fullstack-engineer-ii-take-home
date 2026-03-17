import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function main() {
  console.log("Resetting database...");

  // Drop all tables and clear migration history
  await db.execute(sql`DROP SCHEMA public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);
  await db.execute(sql`DELETE FROM drizzle.__drizzle_migrations`);

  // Re-run migrations
  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Database reset complete. Run 'bun run db:seed' to re-seed.");
  await client.end();
}

main().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});
