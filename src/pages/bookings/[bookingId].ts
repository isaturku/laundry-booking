import { eq } from "drizzle-orm";
import db from "../../db";
import { booking } from "../../db/schema";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async (context) => {
  const { bookingId } = context.params;
  const session = await context.locals.auth.validate();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401
    });
  }
  const deletedIds = await db.delete(booking).where(eq(booking.id, bookingId as string)).returning({ deletedId: booking.id })
  if (deletedIds.length > 0) {
    return new Response("Unknown Error", { status: 200 })
  }
  return new Response("Unknown Error", { status: 500 })
}
