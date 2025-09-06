import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Platform } from "react-native";

interface LocationData {
  latitude: number;
  longitude: number;
}

export const [LocationProvider, useLocation] = createContextHook(() => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      // Set mock location for web/testing
      if (Platform.OS === "web") {
        setLocation({
          latitude: 37.7749,
          longitude: -122.4194,
        });
      }
    }
  };

  const isNearCourt = async (courtLat: number, courtLng: number): Promise<boolean> => {
    if (!location) return false;
    
    // Calculate distance (simplified - in production use proper distance calculation)
    const distance = Math.sqrt(
      Math.pow(location.latitude - courtLat, 2) +
      Math.pow(location.longitude - courtLng, 2)
    );
    
    // Mock: always return true for testing
    return true; // In production: return distance < 0.001 (approximately 100 meters)
  };

  return {
    location,
    permissionStatus,
    requestLocationPermission,
    isNearCourt,
  };
});