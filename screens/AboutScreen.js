// screens/AboutScreen.js — professional and neat About / About Us screen
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Put your image at: ./assets/jessan.jpg
const LOCAL_PROFILE = require("../assets/jessan.jpg");

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* Photo + subtle border */}
          <View style={styles.photoWrap}>
            <Image source={LOCAL_PROFILE} style={styles.photo} resizeMode="cover" />
          </View>

          {/* Name + title */}
          <Text style={styles.name}>Jessan John Orevillo</Text>
          <Text style={styles.role}>Student / Developer</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Details grid */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Submitted to</Text>
              <Text style={styles.detailValue}>Jay Ian Camelotes</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bio</Text>
              <Text style={styles.detailValue}>Life is life if it's life.</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>Katipunan Poblacion, Trinidad, Bohol</Text>
            </View>
          </View>

          {/* Small footer / action */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Thanks for checking out this demo app.</Text>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f0b1a" },
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 760,
    backgroundColor: "#111018",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    // subtle shadow (Android elevation + iOS shadow)
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },

  photoWrap: {
    width: 160,
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(124,58,237,0.18)",
    marginBottom: 14,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  role: {
    color: "#bfb7ff",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginVertical: 12,
  },

  details: { width: "100%" },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.02)",
  },

  detailLabel: {
    color: "#bfb7ff",
    fontSize: 13,
    width: "40%",
    fontWeight: "700",
  },

  detailValue: {
    color: "#ddd",
    fontSize: 14,
    width: "58%",
    textAlign: "right",
  },

  footer: {
    marginTop: 18,
    width: "100%",
    alignItems: "center",
  },

  footerText: {
    color: "#9a96c9",
    fontSize: 13,
    marginBottom: 12,
  },

  backBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#7c3aed",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
  },

  backBtnText: {
    color: "#7c3aed",
    fontWeight: "700",
  },
});
