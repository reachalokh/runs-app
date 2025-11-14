import {
    countRsvps as apiCountRsvps,
    createGame as apiCreateGame,
    deleteGame as apiDeleteGame,
    getPlayerGames as apiGetPlayerGames,
    rsvpToGame as apiRsvpToGame,
    updateGame as apiUpdateGame,
    getUpcomingGames,
} from "@/lib/api";
import createContextHook from "@nkzw/create-context-hook";
import { useState } from "react";

// Minimal mock fallback for games
const MOCK_GAMES = [] as any[];

export const [GamesProvider, useGames] = createContextHook(() => {
  const [upcoming, setUpcoming] = useState<any[]>(MOCK_GAMES);
  const [loading, setLoading] = useState(false);

  const fetchUpcoming = async (opts?: { limit?: number; court_id?: number; host_id?: number }) => {
    setLoading(true);
    try {
      const { data, error } = await getUpcomingGames(opts);
      setLoading(false);
      if (error || !data) return [];
      const results = data.results || [];
      setUpcoming(results);
      return results;
    } catch (e) {
      setLoading(false);
      console.warn('getUpcomingGames error', e);
      return [];
    }
  };

  const createGame = async (body: any) => {
    return await apiCreateGame(body);
  };

  const rsvpToGame = async (body: any) => {
    return await apiRsvpToGame(body);
  };

  const updateGame = async (body: any) => {
    return await apiUpdateGame(body);
  };

  const deleteGame = async (game_id: number) => {
    return await apiDeleteGame(game_id);
  };

  const countRsvps = async (game_id: number) => {
    return await apiCountRsvps(game_id);
  };

  const getPlayerGames = async (player_id?: number, upcomingOnly?: boolean) => {
    return await apiGetPlayerGames(player_id, upcomingOnly, false);
  };

  return {
    upcoming,
    loading,
    fetchUpcoming,
    createGame,
    rsvpToGame,
    updateGame,
    deleteGame,
    countRsvps,
    getPlayerGames,
  };
});
