import * as schema from "./schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("test.db");
const db = drizzle(sqlite, { schema });
export default db;
