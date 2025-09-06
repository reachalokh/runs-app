import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export default function IndexScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/signin" />;
  }

  return <Redirect href="/(tabs)/courts" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});