import { createSignal, type Component, Switch, Match, createMemo, createEffect, For } from "solid-js";
import { booking, type TBooking, type TLaundryMachine } from "../db/schema";
import { LAUNDRY_MACHINE_TYPES } from "../db/constants";

interface LaundryMachineWithBookings extends TLaundryMachine {
  bookings: TBooking[]
}

type Props = {
  machines: LaundryMachineWithBookings[]
}

const BookingForm: Component<Props> = (props) => {
  const [machineType, setMachineType] = createSignal<keyof (typeof LAUNDRY_MACHINE_TYPES)>("washer");
  const [selectedTime, setSelectedTime] = createSignal<Date | undefined>();
  const [selectedDuration, setSelectedDuration] = createSignal<1 | 1.5 | 2>(1);
  const maxDate = new Date()
  maxDate.setDate(new Date().getDate() + 14)
  const endTime = createMemo(() => {
    const selectedStartTime = selectedTime();
    if (!selectedStartTime) return;
    const tmp = new Date(selectedStartTime.getTime());
    tmp.setHours(selectedStartTime.getHours() + selectedDuration())
    if (selectedDuration() === 1.5) tmp.setMinutes(tmp.getMinutes() + 30)
    return tmp;
  })

  return (
    <form method="post" class="flex flex-col gap-4 items-center w-full max-w-xs mx-auto">
      <div class="flex gap-8 justify-center">
        <label class="label cursor-pointer flex gap-2" onclick={() => setMachineType("washer")}>
          <span class="label-text">Washing Machine</span>
          <input type="radio" name="type" class="radio" value="washer" checked />
        </label>
        <label class="label cursor-pointer flex gap-2" onclick={() => setMachineType("dryer")}>
          <span class="label-text">Dryer</span>
          <input type="radio" name="type" class="radio" value="dryer" />
        </label>
      </div>
      <input
        class="input input-primary"
        type="datetime-local"
        name="start-time"
        placeholder="Date of Booking"
        alt="Date of Booking"
        min={new Date().toISOString().substring(0, 16)}
        max={maxDate.toISOString().substring(0, 16)}
        onchange={(e) => setSelectedTime(new Date(e.currentTarget.value))}
        required
      />
      <select name="duration" class="select select-primary" onchange={(e) => {
        setSelectedDuration(parseFloat(e.currentTarget.value) as 1 | 1.5 | 2)
      }}>
        <option value={1} selected>1 hour</option>
        <option value={1.5}>1 hour 30 min</option>
        <option value={2}>2 hour</option>
      </select>
      <input class="hidden" name="end-time" type="text" value={endTime()?.toISOString().substring(0, 16)} />
      {props.machines.filter(machine => machine.type === machineType()).map((machine) => {
        const isAvailable = machine.bookings.findIndex((booking) => {
          const selectedStartTime = selectedTime();
          const selectedEndTime = endTime();
          if (!selectedStartTime || !selectedEndTime) return;
          const hasStartTimeConflict = selectedStartTime.getTime() >= booking.startTime && selectedStartTime.getTime() < booking.endTime
          const hasEndTimeConflict = selectedEndTime.getTime() > booking.startTime && selectedEndTime.getTime() <= booking.endTime
          return hasStartTimeConflict || hasEndTimeConflict;
         
        }) === -1;
        return (
          <label class="label cursor-pointer flex w-full content-between" >
            <span class="label-text">{machine.description}</span>
            {isAvailable ?
              <span class="label-text text-success">Available</span> :
              <> <span class="label-text text-error">Not Available</span>
                {/* @ts-ignore */}
                <button type="button" onclick="schedule_modal.showModal()">
                  <span class="font-icon  text-error">calendar_month</span>
                </button>
                <dialog id="schedule_modal" class="modal">
                  <div class="modal-box">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Start Time</th>
                          <th>End Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          machine.bookings.map((booking) => (
                            <>
                              <tr>
                                <td>
                                  {new Intl.DateTimeFormat("en-GB", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  }).format(new Date(booking.startTime))}
                                </td>
                                <td>
                                  {new Intl.DateTimeFormat("en-GB", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  }).format(new Date(booking.endTime))}
                                </td>
                              </tr>
                            </>
                          ))
                        }
                      </tbody>
                    </table>
                    <div class="modal-action">
                      <form method="dialog">
                        <button class="btn">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </>
            }
            <input type="radio" name="machine-id" class="radio" value={machine.id} disabled={!isAvailable} required />
          </label>
        )
      })}
      <input type="submit" class="btn btn-primary" value={machineType() === "washer" ? "Book Washer":"Book Dryer"} />
    </form>
  )
}

export default BookingForm;
