import { useEffect, useState } from "react";
import { fetchTutorHolidays } from "@/services/firebase";

export const useHoliday = (tutor: string) => {
  const [holidays, setHolidays] = useState<
    { start: string; end: string; reason: string }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTutorHolidays(tutor);
      setHolidays(data);
    };
    if (tutor) load();
  }, [tutor]);

  return holidays;
};
