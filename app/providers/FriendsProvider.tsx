import { MOCK_PLAYERS } from "@/constants/mockData";
import { getPlayerGames, playerSearch } from "@/lib/api";
import createContextHook from "@nkzw/create-context-hook";
import { useState } from "react";

export const [FriendsProvider, useFriends] = createContextHook(() => {
  const [friends, setFriends] = useState(MOCK_PLAYERS.slice(0, 3));
  const [friendRequests, setFriendRequests] = useState(MOCK_PLAYERS.slice(3, 5));

  const getPlayerById = (id: string) => {
    return MOCK_PLAYERS.find((player) => player.id === id);
  };

  const isFriend = (playerId: string) => {
    return friends.some((friend) => friend.id === playerId);
  };

  const sendFriendRequest = (playerId: string) => {
    console.log("Friend request sent to:", playerId);
    return true;
  };

  const acceptRequest = (requestId: string) => {
    const request = friendRequests.find((r) => r.id === requestId);
    if (request) {
      setFriends([...friends, request]);
      setFriendRequests(friendRequests.filter((r) => r.id !== requestId));
    }
  };

  const rejectRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter((r) => r.id !== requestId));
  };

  // Search players via Supabase function; falls back to empty array when unavailable
  const searchPlayers = async (query: string, limit = 10) => {
    try {
      const { data, error } = await playerSearch(query, limit);
      if (error || !data) return [];
      // api returns { results: [...] } per functions in the backend
      const results = data.results || [];
      return results.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        profileImage: p.profile_image || '',
      }));
    } catch (e) {
      console.warn('playerSearch error', e);
      return [];
    }
  };

  // Fetch games for a player (wrapper around getPlayerGames)
  const fetchPlayerGames = async (playerId?: number, upcoming?: boolean) => {
    try {
      const { data, error } = await getPlayerGames(playerId, upcoming, false);
      if (error || !data) return [];
      return data.results || [];
    } catch (e) {
      console.warn('getPlayerGames error', e);
      return [];
    }
  };

  return {
    friends,
    friendRequests,
    getPlayerById,
    isFriend,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    searchPlayers,
    fetchPlayerGames,
  };
});