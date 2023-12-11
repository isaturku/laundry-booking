import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { laundryMachine } from './schema';

const sqlite = new Database('test.db');
const db = drizzle(sqlite);

await db.delete(laundryMachine)

await db.insert(laundryMachine).values({
  id: "wm-1",
  description: "Washing Machine 1",
  type: "washer"
})

await db.insert(laundryMachine).values({
  id: "wm-2",
  description: "Washing Machine 2",
  type: "washer"
})

await db.insert(laundryMachine).values({
  id: "d-1",
  description: "Dryer 1",
  type: "dryer"
})
