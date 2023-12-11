import { relations, type InferSelectModel } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import { keyof, literal, picklist, string } from "valibot";
import { LAUNDRY_MACHINE_TYPES } from "./constants";


export const booking = sqliteTable("bookings", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").references(() => users.id),
  laundryMachineId: text("laundry_machine_id").references(() => laundryMachine.id),
  startTime: integer("start_time").notNull().default(new Date().getTime()),
  endTime: integer("end_time").notNull().default(new Date().getTime()),
})

export const bookingRelations = relations(booking, ({ one }) => ({
  user: one(users, {
    fields: [booking.userId],
    references: [users.id],
  }),
  laundryMachine: one(laundryMachine, {
    fields: [booking.laundryMachineId],
    references: [laundryMachine.id]
  })
}))

export type TBooking = InferSelectModel<typeof booking>;

export const laundryMachine = sqliteTable("laundry_machines", {
  id: text("id").notNull().primaryKey(),
  description: text("description").notNull(),
  type: text("type").notNull().default("washer"),
  isWorking: integer("is_working").notNull().default(1)
})

export const laundryMachineRelation = relations(laundryMachine, ({ many }) => ({
  bookings: many(booking)
}))

export type TLaundryMachine = InferSelectModel<typeof laundryMachine>;


export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username"),
  room: integer("room_nr"),
  admin: integer("admin").notNull().default(0)
});

export const userRelations = relations(users, ({ many }) => ({
  bookings: many(booking)
}))

export const userKey = sqliteTable("user_key", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  hashedPassword: text("hashed_password")
})

export const userSession = sqliteTable("user_session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  activeExpires: integer("active_expires").notNull(),
  idleExpires: integer("idle_expires").notNull(),
})
