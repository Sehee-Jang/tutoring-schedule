// hooks/useTutorSchedule.ts
import { useAuth } from "@/context/AuthContext";
import { useAvailability } from "@/context/AvailabilityContext";
import { useState, useEffect } from "react";

export function useTutorSchedule() {
  const { user } = useAuth();
  const { availability: globalAvailability, updateAvailability } =
    useAvailability();
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    if (user && globalAvailability[user.name]) {
      // 현재 날짜 기준으로 슬롯을 가져옴
      const todayString = new Date().toISOString().split("T")[0];
      const userAvailability = globalAvailability[user.name][todayString] || [];
      setSlots(userAvailability);
    }
  }, [user, globalAvailability]);

  const toggleSlot = (slot: string) => {
    setSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const save = async () => {
    if (!user) return;
    const todayString = new Date().toISOString().split("T")[0];
    await updateAvailability(user.name, todayString, slots);
  };

  return {
    slots,
    toggleSlot,
    save,
  };
}
