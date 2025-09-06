import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useFriends } from "@/providers/FriendsProvider";
import { MessageCircle, UserPlus, Trophy, MapPin } from "lucide-react-native";

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams();
  const { getPlayerById, sendFriendRequest, isFriend } = useFriends();
  const [player, setPlayer] = useState<any>(null);
  const [isAlreadyFriend, setIsAlreadyFriend] = useState(false);

  useEffect(() => {
    const playerData = getPlayerById(id as string);
    setPlayer(playerData);
    setIsAlreadyFriend(isFriend(id as string));
  }, [id]);

  if (!player) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const stats = [
    { label: "Games", value: "127" },
    { label: "Courts", value: "15" },
    { label: "Friends", value: "42" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: player.profileImage }} style={styles.profileImage} />
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.position}>
          {player.position} • {player.height}
        </Text>
        
        <View style={styles.actionButtons}>
          {!isAlreadyFriend && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => sendFriendRequest(player.id)}
            >
              <UserPlus color="white" size={20} />
              <Text style={styles.buttonText}>Add Friend</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.messageButton, isAlreadyFriend && styles.fullWidthButton]}
            onPress={() => router.push(`/chat/${player.id}`)}
          >
            <MessageCircle color="white" size={20} />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Trophy color="#FF6B35" size={20} />
          <Text style={styles.sectionTitle}>Favorite Courts</Text>
        </View>
        <View style={styles.courtItem}>
          <MapPin color="#666" size={16} />
          <Text style={styles.courtName}>Sunset Park</Text>
        </View>
        <View style={styles.courtItem}>
          <MapPin color="#666" size={16} />
          <Text style={styles.courtName}>Downtown Court</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  fullWidthButton: {
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  courtItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 8,
  },
  courtName: {
    fontSize: 16,
    color: "#333",
  },
});