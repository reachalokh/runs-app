import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Map, Users, MessageCircle, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useLocation } from "@/providers/LocationProvider";

export default function TabLayout() {
  const { requestLocationPermission } = useLocation();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#999",
        headerStyle: {
          backgroundColor: "#FF6B35",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="courts"
        options={{
          title: "Courts",
          tabBarIcon: ({ color }) => <Map color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color }) => <Users color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}