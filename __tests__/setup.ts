import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const testDb = drizzle(client, { schema });

afterAll(async () => {
  await client.end();
});
