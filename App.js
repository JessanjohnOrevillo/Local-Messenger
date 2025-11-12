// App.js — Welcome with KeyboardAvoidingView
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initDb } from "./lib/db";

import AuthScreen from "./screens/AuthScreen";
import UsersScreen from "./screens/UsersScreen";
import ChatScreen from "./screens/ChatScreen";

const Stack = createNativeStackNavigator();

function Welcome({ navigation }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} keyboardVerticalOffset={90}>
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.title}>Welcome to Local Messenger</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Auth")}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  useEffect(() => {
    initDb();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: "#120f17" },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: "#0f0b1a" },
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ title: "Login / Register" }} />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f0b1a" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  title: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 30, textAlign: "center" },
  button: {
    backgroundColor: "#7c3aed",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#7c3aed",
    elevation: 4,
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});