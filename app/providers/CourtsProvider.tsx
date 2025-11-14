import { MOCK_COURTS } from "@/constants/mockData";
import { invokeFunction, isSupabaseConfigured } from "@/lib/supabase";
import createContextHook from "@nkzw/create-context-hook";
import { useState } from "react";

export const [CourtsProvider, useCourts] = createContextHook(() => {
  const [courts, setCourts] = useState(MOCK_COURTS);
  const [loading, setLoading] = useState(false);

  // Fetch nearby courts from Supabase Edge Function if configured
  const fetchNearbyCourts = async (lat: number, lng: number, radius_km = 10, limit = 50) => {
    if (!isSupabaseConfigured) return { data: MOCK_COURTS, error: 'not-configured' };

    setLoading(true);
    const { data, error } = await invokeFunction('getNearbyCourts', {
      method: 'GET',
      query: { lat, lng, radius_km, limit },
    });
    setLoading(false);

    if (error) {
      console.warn('getNearbyCourts error:', error);
      return { data: MOCK_COURTS, error };
    }

    const results = (data && data.results) ? data.results : [];
    // Normalize fields expected by UI
    const normalized = results.map((c: any) => ({
      id: String(c.id),
      name: c.name,
      latitude: Number(c.latitude),
      longitude: Number(c.longitude),
      image: c.image || '',
      playersCount: c.players_count ?? 0,
      distance: c.distance_km ? `${c.distance_km.toFixed(1)} km` : undefined,
    }));

    setCourts(normalized);
    return { data: normalized, error: null };
  };

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
  fetchNearbyCourts,
  };
});