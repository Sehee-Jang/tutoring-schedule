import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchAllTutorAvailability,
  saveTutorAvailability,
} from "../services/firebase";

const AvailabilityContext = createContext();

export const useAvailability = () => useContext(AvailabilityContext);

export const AvailabilityProvider = ({ children }) => {
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllTutorAvailability();
      setAvailability(data);
    };
    load();
  }, []);

  const updateAvailability = async (tutor, slots) => {
    await saveTutorAvailability(tutor, slots);
    setAvailability((prev) => ({ ...prev, [tutor]: slots }));
  };

  return (
    <AvailabilityContext.Provider value={{ availability, updateAvailability }}>
      {children}
    </AvailabilityContext.Provider>
  );
};
