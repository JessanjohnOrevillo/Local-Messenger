
// App.js — Welcome screen that navigates to About screen (About Us button below Get Started)
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initDb } from "./lib/db";

import AuthScreen from "./screens/AuthScreen";
import UsersScreen from "./screens/UsersScreen";
import ChatScreen from "./screens/ChatScreen";
import AboutScreen from "./screens/AboutScreen";

const Stack = createNativeStackNavigator();

function Welcome({ navigation }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={90}
    >
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.title}>Welcome to Local Messenger</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Auth")}
            accessibilityLabel="Get Started"
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          {/* ABOUT US button — same design but smaller and placed under Get Started */}
          <TouchableOpacity
            style={[styles.button, styles.aboutButton]}
            onPress={() => navigation.navigate("About")}
            accessibilityLabel="About Us"
          >
            <Text style={[styles.buttonText, styles.aboutText]}>About Us</Text>
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
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: "Login / Register" }}
        />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "About" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f0b1a" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 30,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#7c3aed",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#7c3aed",
    elevation: 4,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  aboutButton: {
    marginTop: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#7c3aed",
  },

  aboutText: {
    color: "#7c3aed",
    fontWeight: "700",
  },
});
