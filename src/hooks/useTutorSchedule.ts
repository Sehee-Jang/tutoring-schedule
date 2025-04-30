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
      setSlots(globalAvailability[user.name]);
    }
  }, [user, globalAvailability]);

  const toggleSlot = (slot: string) => {
    setSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const save = async () => {
    if (!user) return;
    await updateAvailability(user.name, slots);
  };

  return {
    slots,
    toggleSlot,
    save,
  };
}
