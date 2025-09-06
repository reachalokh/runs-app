import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import { Camera, Ruler, Users } from "lucide-react-native";
import { POSITIONS } from "@/constants/basketball";

export default function ProfileSetupScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [height, setHeight] = useState("");
  const [position, setPosition] = useState("");
  const { updateProfile } = useAuth();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleComplete = async () => {
    if (!height || !position) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    await updateProfile({
      profileImage: profileImage || "https://ui-avatars.com/api/?name=Player&background=FF6B35&color=fff",
      height,
      position,
    });
    
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient colors={["#FF6B35", "#FF8C42"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Let other players know about you</Text>
          </View>

          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Camera color="#999" size={40} />
                  <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Ruler color="#999" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Height (e.g., 6'2'')"
                placeholderTextColor="#999"
                value={height}
                onChangeText={setHeight}
                testID="height-input"
              />
            </View>

            <View style={styles.sectionTitle}>
              <Users color="#666" size={20} />
              <Text style={styles.sectionTitleText}>Select Your Position</Text>
            </View>

            <View style={styles.positionsGrid}>
              {POSITIONS.map((pos) => (
                <TouchableOpacity
                  key={pos.id}
                  style={[
                    styles.positionCard,
                    position === pos.id && styles.positionCardSelected,
                  ]}
                  onPress={() => setPosition(pos.id)}
                >
                  <Text style={styles.positionAbbr}>{pos.abbr}</Text>
                  <Text style={styles.positionName}>{pos.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete Setup</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleComplete}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: "#999",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  positionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    marginBottom: 24,
  },
  positionCard: {
    width: "31%",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    margin: "1.16%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  positionCardSelected: {
    backgroundColor: "#FFF5F2",
    borderColor: "#FF6B35",
  },
  positionAbbr: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  positionName: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  completeButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  completeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  skipText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    color: "#999",
  },
});