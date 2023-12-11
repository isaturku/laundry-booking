// src/lib/lucia.ts
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import sqlite from "better-sqlite3";
import { facebook, google } from "@lucia-auth/oauth/providers"

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
      username: data.username,
      roomNr: data.room_nr,
      admin: data.admin
    };
  }
});

export const googleAuth = google(auth, {
  clientId: import.meta.env.GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:4321/login/google/callback"
})

export type Auth = typeof auth;
