// 가나다 순 정렬 함수
export const sortByName = <T extends { name: string }>(array: T[]): T[] => {
  return [...array].sort((a, b) => a.name.localeCompare(b.name));
};

// 숫자 기반 정렬 함수 (기수 정렬)
export const sortByNumericBatch = <T extends { name: string }>(
  array: T[]
): T[] => {
  return [...array].sort((a, b) => {
    const aNumber = parseInt(a.name.replace(/[^0-9]/g, "")) || 0;
    const bNumber = parseInt(b.name.replace(/[^0-9]/g, "")) || 0;
    return aNumber - bNumber;
  });
};
