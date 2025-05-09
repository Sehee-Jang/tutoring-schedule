import { useEffect, useState } from "react";
import { fetchTutorHolidays } from "@/services/firebase";
import type { Holiday } from "@/types/tutor"; 

export const useHoliday = (tutor: string) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTutorHolidays(tutor);
      setHolidays(data);
    };
    if (tutor) load();
  }, [tutor]);

  return holidays;
};
