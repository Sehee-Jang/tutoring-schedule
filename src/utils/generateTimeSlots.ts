// 9-21까지 30분 시간 슬롯 생성
// export const generateTimeSlots = (startHour = 9, endHour = 21) => {
//   const slots: string[] = [];
//   for (let hour = startHour; hour < endHour; hour++) {
//     slots.push(
//       `${hour.toString().padStart(2, "0")}:00-${hour
//         .toString()
//         .padStart(2, "0")}:30`
//     );
//     slots.push(
//       `${hour.toString().padStart(2, "0")}:30-${(hour + 1)
//         .toString()
//         .padStart(2, "0")}:00`
//     );
//   }
//   return slots;
// };

// 9-21시까지 시간 슬롯 생성 및 시간 간격 30분/60분 중 선택
// export const generateTimeSlots = (
//   startHour = 9,
//   endHour = 21,
//   interval: "30min" | "60min" = "30min"
// ) => {
//   const slots: string[] = [];
//   const step = interval === "30min" ? 30 : 60;

//   for (let hour = startHour; hour < endHour; hour++) {
//     const hourStr = hour.toString().padStart(2, "0");
//     if (interval === "30min" || interval === "60min") {
//       slots.push(`${hourStr}:00-${hourStr}:${step === 30 ? "30" : "00"}`);
//       if (step === 30) {
//         slots.push(`${hourStr}:30-${(hour + 1).toString().padStart(2, "0")}:00`);
//       }
//     }
//   }
//   return slots;
// };

// 유연한 시간 슬롯 생성 함수
export const generateTimeSlots = (
  startTime: string = "09:00", // 기본값: 오전 9시
  endTime: string = "21:00", // 기본값: 오후 9시
  intervalMinutes: number = 30 // 기본값: 30분 간격
): string[] => {
  const slots: string[] = [];

  // 시작 시간과 종료 시간을 Date 객체로 변환
  let current = new Date(`2025-01-01T${startTime}:00`);
  const end = new Date(`2025-01-01T${endTime}:00`);

  while (current < end) {
    const next = new Date(current.getTime() + intervalMinutes * 60 * 1000);
    slots.push(
      `${current.toTimeString().slice(0, 5)}-${next.toTimeString().slice(0, 5)}`
    );
    current = next;
  }

  return slots;
};
