/**
 * 시간 슬롯 배열을 시간 순으로 정렬하는 함수
 * 예: ["13:00-13:30", "09:00-09:30"] → ["09:00-09:30", "13:00-13:30"]
 * @param {string[]} slots - "HH:mm-HH:mm" 형식의 시간 슬롯 배열
 * @returns {string[]} 정렬된 시간 슬롯 배열
 */
const sortTimeSlots = (slots) => {
  return [...slots].sort((a, b) => {
    const [aHour, aMin] = a.split("-")[0].split(":").map(Number);
    const [bHour, bMin] = b.split("-")[0].split(":").map(Number);
    return aHour * 60 + aMin - (bHour * 60 + bMin);
  });
};

export default sortTimeSlots;
