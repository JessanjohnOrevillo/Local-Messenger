// components/Avatar.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Avatar({ uri, size = 44, username }) {
  const style = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[style, styles.image]} />;
  }
  const initial = username ? username.charAt(0).toUpperCase() : "?";
  return (
    <View style={[style, styles.placeholder]}>
      <Text style={{ color: "#fff", fontWeight: "700" }}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: "#333" },
  placeholder: { backgroundColor: "#4b3675", alignItems: "center", justifyContent: "center" },
});