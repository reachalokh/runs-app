import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import { useAuth } from "@/providers/AuthProvider";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      text: "Hey! Want to play tomorrow?",
      sender: "other",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "Sure! What time works for you?",
      sender: "me",
      timestamp: "10:32 AM",
    },
  ]);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "me" ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={[
        styles.messageText,
        item.sender === "me" ? styles.myMessageText : styles.otherMessageText,
      ]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Send color="white" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#FF6B35",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#FF6B35",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});