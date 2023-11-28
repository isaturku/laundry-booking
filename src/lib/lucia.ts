// src/lib/lucia.ts
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import sqlite from "better-sqlite3";

const db = sqlite("test.db");

export const auth = lucia({
  adapter: betterSqlite3(db, {
    user: "user",
    key: "user_key",
    session: "user_session"
  }),
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: astro(),

  getUserAttributes: (data) => {
    return {
      username: data.username
    };
  }
});

export type Auth = typeof auth;
