import createContextHook from "@nkzw/create-context-hook";
import { useState } from "react";
import { MOCK_PLAYERS } from "@/constants/mockData";

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

  return {
    friends,
    friendRequests,
    getPlayerById,
    isFriend,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
  };
});