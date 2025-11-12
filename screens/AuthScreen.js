// screens/AuthScreen.js — uses KeyboardAvoidingView
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { executeSqlAsync } from "../lib/db";

export default function AuthScreen({ navigation }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileUri, setProfileUri] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        await ImagePicker.requestCameraPermissionsAsync();
      } catch (e) {}
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,
        allowsEditing: true,
        aspect: [1, 1],
      });
      const uri = result.cancelled ? null : (result.assets ? result.assets[0].uri : result.uri);
      if (!result.cancelled && uri) setProfileUri(uri);
    } catch (e) {
      console.log("Image pick error", e);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,
        allowsEditing: true,
        aspect: [1, 1],
      });
      const uri = result.cancelled ? null : (result.assets ? result.assets[0].uri : result.uri);
      if (!result.cancelled && uri) setProfileUri(uri);
    } catch (e) {
      console.log("Camera error", e);
    }
  };

  const removePhoto = () => setProfileUri(null);

  const register = async () => {
    const name = username.trim();
    if (!name || !password) {
      Alert.alert("Validation", "Enter username and password.");
      return;
    }
    try {
      const ts = Date.now();
      await executeSqlAsync(
        `INSERT INTO users (username, password, profile_uri, created_at) VALUES (?, ?, ?, ?);`,
        [name, password, profileUri, ts]
      );
      Alert.alert("Success", "Registered. You can log in now.");
      setMode("login");
      setPassword("");
    } catch (e) {
      console.log("register error:", e);
      if (e.message && e.message.toLowerCase().includes("unique")) {
        Alert.alert("Error", "Username already exists.");
      } else {
        Alert.alert("Error", "Could not register user.");
      }
    }
  };

  const login = async () => {
    const name = username.trim();
    if (!name || !password) {
      Alert.alert("Validation", "Enter username and password.");
      return;
    }
    try {
      const res = await executeSqlAsync("SELECT id, username, profile_uri FROM users WHERE username = ? AND password = ?;", [
        name,
        password,
      ]);
      if (res.rows.length > 0) {
        const user = res.rows.item(0);
        navigation.reset({ index: 0, routes: [{ name: "Users", params: { user } }] });
      } else {
        Alert.alert("Login failed", "Wrong username or password.");
      }
    } catch (e) {
      console.log("login error:", e);
      Alert.alert("Error", "Could not login.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} keyboardVerticalOffset={90}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.brand}>Local Messenger</Text>

            {mode === "register" && (
              <View style={{ alignItems: "center", marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Avatar",
                      "Choose an option",
                      [
                        { text: "Pick from gallery", onPress: pickImage },
                        { text: "Take photo", onPress: takePhoto },
                        { text: "Remove photo", onPress: removePhoto, style: "destructive" },
                        { text: "Cancel", style: "cancel" },
                      ],
                      { cancelable: true }
                    )
                  }
                >
                  {profileUri ? <Image source={{ uri: profileUri }} style={styles.avatarLarge} /> : (
                    <View style={[styles.avatarLarge, styles.avatarPlaceholder]}>
                      <Text style={{ fontSize: 28, color: "#fff" }}>+</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={{ marginTop: 8, color: "#ddd" }}>Tap to add photo (optional)</Text>
              </View>
            )}

            <TextInput placeholder="Username" placeholderTextColor="#bbb" value={username} onChangeText={setUsername} style={styles.input} autoCapitalize="none" />
            <TextInput placeholder="Password" placeholderTextColor="#bbb" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

            <TouchableOpacity style={styles.primaryBtn} onPress={() => (mode === "register" ? register() : login())}>
              <Text style={styles.primaryBtnText}>{mode === "register" ? "Create account" : "Sign in"}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 12 }}>
              <Text style={{ color: "#ccc" }}>{mode === "register" ? "Already have an account?" : "New to Local Messenger?"} </Text>
              <TouchableOpacity onPress={() => setMode(mode === "register" ? "login" : "register")}>
                <Text style={{ color: "#b387ff", fontWeight: "700" }}>{mode === "register" ? "Sign in" : "Create account"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.footer}>By continuing you accept the terms — this is a demo app.</Text>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0b13", padding: 16, justifyContent: "center" },
  card: { backgroundColor: "#150f2e", borderRadius: 14, padding: 20, shadowColor: "#000", shadowOpacity: 0.4, elevation: 6 },
  brand: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 12, alignSelf: "center" },
  input: { borderWidth: 1, borderColor: "#241f2a", backgroundColor: "#0f0d12", color: "#fff", padding: 12, borderRadius: 10, marginBottom: 12 },
  primaryBtn: { backgroundColor: "#9146ff", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  avatarLarge: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#2a2430", overflow: "hidden" },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center", backgroundColor: "#3b2a64" },
  footer: { color: "#666", textAlign: "center", marginTop: 14 },
});