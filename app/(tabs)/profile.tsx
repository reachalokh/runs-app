import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { Edit, MapPin, Trophy, LogOut, Settings } from "lucide-react-native";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            signOut();
            router.replace("/(auth)");
          },
        },
      ]
    );
  };

  const stats = [
    { label: "Games Played", value: "42" },
    { label: "Courts Visited", value: "8" },
    { label: "Friends", value: "23" },
  ];

  const topCourts = [
    { name: "Sunset Park", visits: 15 },
    { name: "Downtown Court", visits: 12 },
    { name: "Beach Basketball", visits: 8 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.position}>
          {user?.position} • {user?.height}
        </Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit color="white" size={16} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
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
          <Text style={styles.sectionTitle}>Top Courts</Text>
        </View>
        {topCourts.map((court, index) => (
          <View key={index} style={styles.courtItem}>
            <MapPin color="#666" size={16} />
            <Text style={styles.courtName}>{court.name}</Text>
            <Text style={styles.courtVisits}>{court.visits} visits</Text>
          </View>
        ))}
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Settings color="#666" size={20} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <LogOut color="#FF3B30" size={20} />
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    marginBottom: 16,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  editButtonText: {
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
  },
  courtName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  courtVisits: {
    fontSize: 14,
    color: "#999",
  },
  menuSection: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});