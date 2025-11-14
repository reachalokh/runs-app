import { AuthProvider } from "@/providers/AuthProvider";
import { CourtsProvider } from "@/providers/CourtsProvider";
import { FriendsProvider } from "@/providers/FriendsProvider";
import { GamesProvider } from "@/providers/GamesProvider";
import { LocationProvider } from "@/providers/LocationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="court/[id]" options={{ 
        title: "Court Details",
        headerStyle: { backgroundColor: "#FF6B35" },
        headerTintColor: "#fff"
      }} />
      <Stack.Screen name="player/[id]" options={{ 
        title: "Player Profile",
        headerStyle: { backgroundColor: "#FF6B35" },
        headerTintColor: "#fff"
      }} />
      <Stack.Screen name="chat/[id]" options={{ 
        title: "Chat",
        headerStyle: { backgroundColor: "#FF6B35" },
        headerTintColor: "#fff"
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <LocationProvider>
            <CourtsProvider>
              <FriendsProvider>
                <GamesProvider>
                  <RootLayoutNav />
                </GamesProvider>
              </FriendsProvider>
            </CourtsProvider>
          </LocationProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}