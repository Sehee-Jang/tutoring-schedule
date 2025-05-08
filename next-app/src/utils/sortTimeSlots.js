// src/utils/sortTimeSlots.js
/**
 * 지정된 시간대를 정렬하는 함수
 * @param {string[]} slots - 정렬할 시간대 배열
 * @returns {string[]} 정렬된 시간대 배열
 */
const sortTimeSlots = (slots) => {
  // slots가 배열이 아닐 경우 빈 배열로 초기화
  if (!Array.isArray(slots)) {
    console.warn("sortTimeSlots: Invalid slots value. Expected an array.");
    return [];
  }

  return [...slots].sort((a, b) => {
    const [aHour, aMin] = a.split("-")[0].split(":").map(Number);
    const [bHour, bMin] = b.split("-")[0].split(":").map(Number);
    return aHour * 60 + aMin - (bHour * 60 + bMin);
  });
};

export default sortTimeSlots;
