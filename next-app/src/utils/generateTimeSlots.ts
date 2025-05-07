export const generateTimeSlots = (startHour = 9, endHour = 21) => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(
      `${hour.toString().padStart(2, "0")}:00-${hour
        .toString()
        .padStart(2, "0")}:30`
    );
    slots.push(
      `${hour.toString().padStart(2, "0")}:30-${(hour + 1)
        .toString()
        .padStart(2, "0")}:00`
    );
  }
  return slots;
};
