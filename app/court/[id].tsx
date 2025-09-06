import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCourts } from "@/providers/CourtsProvider";
import { useLocation } from "@/providers/LocationProvider";
import { useAuth } from "@/providers/AuthProvider";
import { MapPin, Users, Clock, TrendingUp } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default function CourtDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getCourtById, checkIn } = useCourts();
  const { location, isNearCourt } = useLocation();
  const { user } = useAuth();
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    const courtData = getCourtById(id as string);
    setCourt(courtData);
    setLoading(false);
  }, [id]);

  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert("Location Required", "Please enable location services to check in.");
      return;
    }

    const nearCourt = await isNearCourt(court.latitude, court.longitude);
    if (!nearCourt) {
      Alert.alert("Too Far", "You need to be at the court to check in.");
      return;
    }

    setCheckingIn(true);
    await checkIn(court.id);
    setCheckingIn(false);
    Alert.alert("Success", "You've checked in successfully!");
  };

  if (loading || !court) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  const chartData = {
    labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
    datasets: [
      {
        data: court.busynessData || [2, 5, 8, 12, 15, 10],
        color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: court.image }} style={styles.courtImage} />
      
      <View style={styles.content}>
        <Text style={styles.courtName}>{court.name}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MapPin color="#666" size={20} />
            <Text style={styles.statText}>{court.distance}</Text>
          </View>
          <View style={styles.statItem}>
            <Users color="#666" size={20} />
            <Text style={styles.statText}>{court.playersCount} players now</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkInButton, checkingIn && styles.checkInButtonDisabled]}
          onPress={handleCheckIn}
          disabled={checkingIn}
        >
          {checkingIn ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.checkInButtonText}>Check In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp color="#FF6B35" size={20} />
            <Text style={styles.sectionTitle}>Today's Activity</Text>
          </View>
          <LineChart
            data={chartData}
            width={width - 64}
            height={200}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#FF6B35",
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users color="#FF6B35" size={20} />
            <Text style={styles.sectionTitle}>Players Here Now</Text>
          </View>
          {court.players && court.players.length > 0 ? (
            court.players.map((player: any) => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerCard}
                onPress={() => router.push(`/player/${player.id}`)}
              >
                <Image source={{ uri: player.profileImage }} style={styles.playerImage} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerPosition}>
                    {player.position} • {player.height}
                  </Text>
                </View>
                {player.id !== user?.id && (
                  <TouchableOpacity style={styles.addFriendButton}>
                    <Text style={styles.addFriendText}>Add</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPlayersText}>No players checked in yet</Text>
          )}
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
  courtImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 20,
  },
  courtName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 16,
    color: "#666",
  },
  checkInButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  checkInButtonDisabled: {
    opacity: 0.6,
  },
  checkInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  playerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 14,
    color: "#666",
  },
  addFriendButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addFriendText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  noPlayersText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    paddingVertical: 20,
  },
});