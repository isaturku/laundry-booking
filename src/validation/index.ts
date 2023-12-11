import { createInsertSchema } from "drizzle-valibot";
import { custom, email, maxValue, minLength, minValue, number, object, picklist, string, toTrimmed } from "valibot";
import { laundryMachine, } from "../db/schema";

export const insertLaundryMachineSchema = createInsertSchema(laundryMachine, {
  type: picklist(["washer", "dryer"])
})
export const insertUserSchema = object({
  username: string([toTrimmed(), minLength(5, "Username is too short, it must be at least 5 characters")]),
  email: string([toTrimmed(), email("The email address is badly formatted.")]),
  room: number([minValue(100, "Room number not valid."), maxValue(799, "Room number not valid.")]),
  password: string([minLength(8, "Password is too short")]),
  passwordConfirm: string([minLength(8, "Password is too short")])
}, [
  custom(
    ({ password, passwordConfirm }) => password === passwordConfirm,
    'The passwords do not match.'
  ),
])
