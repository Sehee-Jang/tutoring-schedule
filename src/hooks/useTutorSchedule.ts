import { useAuth } from "@/context/AuthContext";
import { useAvailability } from "@/context/AvailabilityContext";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export function useTutorSchedule() {
  const { user } = useAuth();
  const { availability: globalAvailability, updateAvailability } =
    useAvailability();
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    if (user && globalAvailability[user.name]) {
      // 현재 날짜 기준으로 슬롯을 가져옴
      const todayString = format(new Date(), "yyyy-MM-dd");
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
    const todayString = format(new Date(), "yyyy-MM-dd");
    await updateAvailability(user.name, todayString, slots);
  };

  return {
    slots,
    toggleSlot,
    save,
  };
}

// hooks/useTutorSchedule.ts
// import { useAuth } from "@/context/AuthContext";
// import { useAvailability } from "@/context/AvailabilityContext";
// import { useState, useEffect } from "react";

// export function useTutorSchedule() {
//   const { user } = useAuth();
//   const { availability: globalAvailability, updateAvailability } =
//     useAvailability();
//   const [slots, setSlots] = useState<string[]>([]);

//   useEffect(() => {
//     if (user && globalAvailability[user.name]) {
//       setSlots(globalAvailability[user.name]);
//     }
//   }, [user, globalAvailability]);

//   const toggleSlot = (slot: string) => {
//     setSlots((prev) =>
//       prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
//     );
//   };

//   const save = async () => {
//     if (!user) return;
//     await updateAvailability(user.name, slots);
//   };

//   return {
//     slots,
//     toggleSlot,
//     save,
//   };
// }
