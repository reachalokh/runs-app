import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useFriends } from "@/providers/FriendsProvider";
import { Search, UserPlus, Check, X } from "lucide-react-native";

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const { friends, friendRequests, acceptRequest, rejectRequest } = useFriends();

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriend = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.friendCard}
      onPress={() => router.push(`/player/${item.id}`)}
    >
      <Image source={{ uri: item.profileImage }} style={styles.friendImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendPosition}>{item.position} • {item.height}</Text>
      </View>
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => router.push(`/chat/${item.id}`)}
      >
        <Text style={styles.messageButtonText}>Message</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRequest = ({ item }: { item: any }) => (
    <View style={styles.requestCard}>
      <Image source={{ uri: item.profileImage }} style={styles.friendImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendPosition}>{item.position} • {item.height}</Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => acceptRequest(item.id)}
        >
          <Check color="white" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectRequest(item.id)}
        >
          <X color="white" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search color="#999" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "friends" && styles.tabActive]}
          onPress={() => setActiveTab("friends")}
        >
          <Text style={[styles.tabText, activeTab === "friends" && styles.tabTextActive]}>
            Friends ({friends.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.tabActive]}
          onPress={() => setActiveTab("requests")}
        >
          <Text style={[styles.tabText, activeTab === "requests" && styles.tabTextActive]}>
            Requests ({friendRequests.length})
          </Text>
          {friendRequests.length > 0 && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      {activeTab === "friends" ? (
        <FlatList
          data={filteredFriends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <UserPlus color="#999" size={48} />
              <Text style={styles.emptyText}>No friends yet</Text>
              <Text style={styles.emptySubtext}>
                Meet players at courts and connect!
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#FF6B35",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "white",
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  friendPosition: {
    fontSize: 14,
    color: "#666",
  },
  messageButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  messageButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#FF3B30",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
});