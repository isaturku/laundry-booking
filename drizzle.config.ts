import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations-folder",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./test.db",
  },
} satisfies Config;
