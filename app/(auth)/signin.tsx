import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { Mail, Lock } from "lucide-react-native";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    const success = await signIn(email, password);
    if (success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  const handleGoogleSignIn = async () => {
    const success = await signInWithGoogle();
    if (success) {
      router.replace("/(tabs)");
    }
  };

  return (
    <LinearGradient colors={["#FF6B35", "#FF8C42"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>🏀</Text>
              </View>
              <Text style={styles.appName}>Hoops</Text>
              <Text style={styles.tagline}>Find your court, find your game</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Mail color="#999" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  testID="email-input"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock color="#999" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  testID="password-input"
                />
              </View>

              <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                <Image
                  source={{ uri: "https://www.google.com/favicon.ico" }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text style={styles.signUpText}>
                  Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 50,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  tagline: {
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  signInButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    height: 56,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  signUpText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
    color: "#666",
  },
  signUpLink: {
    color: "#FF6B35",
    fontWeight: "600",
  },
});