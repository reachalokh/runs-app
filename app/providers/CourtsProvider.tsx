import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import { MOCK_COURTS } from "@/constants/mockData";

export const [CourtsProvider, useCourts] = createContextHook(() => {
  const [courts, setCourts] = useState(MOCK_COURTS);
  const [loading, setLoading] = useState(false);

  const getCourtById = (id: string) => {
    return courts.find((court) => court.id === id);
  };

  const checkIn = async (courtId: string) => {
    // Mock check-in
    setCourts((prev) =>
      prev.map((court) =>
        court.id === courtId
          ? { ...court, playersCount: court.playersCount + 1 }
          : court
      )
    );
    return true;
  };

  return {
    courts,
    loading,
    getCourtById,
    checkIn,
  };
});