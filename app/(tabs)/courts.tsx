import { useCourts } from "@/providers/CourtsProvider";
import { useLocation } from "@/providers/LocationProvider";
import { router } from "expo-router";
import { MapPin, Navigation, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

// Interactive map component that works on both web and mobile
const MapComponent = ({ location, courts }: { location: any; courts: any[] }) => {
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: location?.latitude || 37.7749,
    longitude: location?.longitude || -122.4194,
    zoom: 14
  });

  // Simulate map markers with a grid layout
  const renderMapMarker = (court: any, index: number) => {
    const isSelected = selectedCourt === court.id;
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    return (
      <TouchableOpacity
        key={court.id}
        style={[
          styles.mapMarker,
          {
            left: 50 + col * 100,
            top: 100 + row * 80,
          },
          isSelected && styles.mapMarkerSelected
        ]}
        onPress={() => {
          setSelectedCourt(isSelected ? null : court.id);
        }}
      >
        <View style={[styles.markerPin, isSelected && styles.markerPinSelected]}>
          <MapPin color={isSelected ? "white" : "#FF6B35"} size={20} />
          {court.playersCount > 0 && (
            <View style={styles.markerBadge}>
              <Text style={styles.markerBadgeText}>{court.playersCount}</Text>
            </View>
          )}
        </View>
        
        {isSelected && (
          <View style={styles.markerPopup}>
            <Text style={styles.markerPopupTitle}>{court.name}</Text>
            <Text style={styles.markerPopupText}>{court.playersCount} players</Text>
            <TouchableOpacity
              style={styles.markerPopupButton}
              onPress={() => router.push(`/court/${court.id}`)}
            >
              <Text style={styles.markerPopupButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mapContainer}>
      {/* Map Background */}
      <View style={styles.mapBackground}>
        <View style={styles.mapGrid}>
          {/* Grid lines to simulate map */}
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, { top: i * 50 }]} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 50 }]} />
          ))}
        </View>
        
        {/* User location marker */}
        <View style={[styles.userLocationMarker, { left: width / 2 - 10, top: 200 }]}>
          <View style={styles.userLocationDot} />
          <View style={styles.userLocationRing} />
        </View>
        
        {/* Court markers */}
        {courts.map((court, index) => renderMapMarker(court, index))}
      </View>
      
      {/* Map controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapControlButton}>
          <Text style={styles.mapControlText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapControlButton}>
          <Text style={styles.mapControlText}>-</Text>
        </TouchableOpacity>
      </View>
      
      {/* Location button */}
      <TouchableOpacity style={styles.locationButton}>
        <Navigation color="#FF6B35" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default function CourtsScreen() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const { courts, loading } = useCourts();
  const { location } = useLocation();
  // optional provider method added to fetch real courts from backend
  const provider = useCourts() as any;
  const fetchNearbyCourts = provider?.fetchNearbyCourts;

  const renderCourtCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.courtCard}
      onPress={() => router.push(`/court/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.courtImage} />
      <View style={styles.courtInfo}>
        <Text style={styles.courtName}>{item.name}</Text>
        <View style={styles.courtStats}>
          <View style={styles.statItem}>
            <MapPin color="#666" size={16} />
            <Text style={styles.statText}>{item.distance}</Text>
          </View>
          <View style={styles.statItem}>
            <Users color="#666" size={16} />
            <Text style={styles.statText}>{item.playersCount} players</Text>
          </View>
        </View>
        {item.playersCount > 0 && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active Now</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Finding nearby courts...</Text>
      </View>
    );
  }

    // fetch from backend when we have a location
    React.useEffect(() => {
      let cancelled = false;
      const load = async () => {
        if (!location || !fetchNearbyCourts) return;
        await fetchNearbyCourts(location.latitude, location.longitude, 10, 50);
        if (cancelled) return;
      };
      load();
      return () => { cancelled = true; };
    }, [location, fetchNearbyCourts]);

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === "map" && styles.toggleButtonActive]}
          onPress={() => setViewMode("map")}
        >
          <Text style={[styles.toggleText, viewMode === "map" && styles.toggleTextActive]}>
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === "list" && styles.toggleButtonActive]}
          onPress={() => setViewMode("list")}
        >
          <Text style={[styles.toggleText, viewMode === "list" && styles.toggleTextActive]}>
            List
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === "map" ? (
        <View style={styles.mapContainer}>
          <MapComponent location={location} courts={courts} />
        </View>
      ) : (
        <FlatList
          data={courts}
          renderItem={renderCourtCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#FF6B35",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  toggleTextActive: {
    color: "white",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: "#E8F5E8",
    position: "relative",
  },
  mapGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  mapMarker: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  mapMarkerSelected: {
    zIndex: 20,
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  markerPinSelected: {
    backgroundColor: "#FF6B35",
    borderColor: "white",
  },
  markerPopup: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  markerPopupTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  markerPopupText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  markerPopupButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  markerPopupButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  userLocationMarker: {
    position: "absolute",
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "white",
  },
  userLocationRing: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
    opacity: 0.3,
  },
  mapControls: {
    position: "absolute",
    right: 16,
    top: 100,
    gap: 8,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapControlText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  locationButton: {
    position: "absolute",
    right: 16,
    bottom: 100,
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  markerActive: {
    backgroundColor: "#FF6B35",
  },
  markerText: {
    fontSize: 20,
  },
  markerBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  markerBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
  },
  courtCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  courtImage: {
    width: "100%",
    height: 180,
  },
  courtInfo: {
    padding: 16,
  },
  courtName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  courtStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: "#666",
  },
  activeBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  nativeMapPlaceholder: {
    flex: 1,
    backgroundColor: "white",
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    gap: 8,
  },
  mapHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  mapCourtsList: {
    padding: 8,
  },
  mapCourtCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  mapCourtImage: {
    width: "100%",
    height: 120,
  },
  mapCourtName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    padding: 8,
    paddingBottom: 4,
  },
  mapCourtStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 4,
  },
  mapCourtStatsText: {
    fontSize: 12,
    color: "#666",
  },
});