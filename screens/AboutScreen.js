// screens/AboutScreen.js — clean version without "JS About This App" header
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from "react-native";

const LOCAL_PROFILE = require("../assets/jessan.jpg");

export default function AboutScreen({ navigation }) {
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>

          {/* 🔥 Photo + Name (now at top) */}
          <View style={styles.previewWrap}>
            <View style={styles.photoWrap}>
              <Image
                source={LOCAL_PROFILE}
                style={styles.photo}
                resizeMode="cover"
              />
            </View>

            <View style={styles.nameBlock}>
              <Text style={styles.name}>Jessan John Orevillo</Text>
              <Text style={styles.role}>Student • Developer</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <Text style={styles.lead}>
            Tap the button below to view the author details and submission info.
          </Text>

          <TouchableOpacity
            activeOpacity={0.86}
            style={styles.actionBtn}
            onPress={() => setVisible(true)}
          >
            <Text style={styles.actionBtnText}>Author / About</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* 🔥 Modal */}
        <Modal
          visible={visible}
          animationType="slide"
          transparent
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalPhotoWrap}>
                  <Image
                    source={LOCAL_PROFILE}
                    style={styles.modalPhoto}
                    resizeMode="cover"
                  />
                </View>

                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.modalName}>Jessan John Orevillo</Text>
                  <Text style={styles.modalSubtitle}>Author / Submitted by</Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Submitted To</Text>
                <Text style={styles.infoValue}>Jay Ian Camelotes</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Short Bio</Text>
                <Text style={styles.infoValue}>
                  I’m a student and developer who enjoys building apps,
                  solving problems, and learning new technologies.
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>
                  Katipunan Poblacion, Trinidad, Bohol
                </Text>
              </View>

              <View style={styles.modalFooter}>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalClose,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => setVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const ACCENT = "#7c3aed";
const BG = "#0f0b1a";
const CARD = "#0f0d16";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 820,
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 20,
    alignItems: "stretch",
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
      },
    }),
  },

  /* --- Top Section --- */
  previewWrap: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  photoWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(124,58,237,0.18)",
    marginRight: 14,
    backgroundColor: "#222",
  },
  photo: {
    width: "100%",
    height: "100%",
  },

  nameBlock: { flex: 1 },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  role: {
    color: "#bfb7ff",
    fontSize: 13,
    marginTop: 4,
  },

  cardDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    marginVertical: 14,
  },

  lead: {
    color: "#cfc6ff",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 20,
  },

  actionBtn: {
    alignSelf: "center",
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 6,
    marginBottom: 12,
  },
  actionBtnText: { color: "#fff", fontWeight: "800", letterSpacing: 0.3 },

  backBtn: {
    alignSelf: "center",
    marginTop: 6,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: ACCENT,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  backBtnText: { color: ACCENT, fontWeight: "700" },

  /* --- Modal --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,6,9,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 760,
    backgroundColor: "#0b0710",
    borderRadius: 14,
    padding: 18,
    ...Platform.select({
      android: { elevation: 10 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 28,
      },
    }),
  },

  modalHeader: { flexDirection: "row", alignItems: "center" },

  modalPhotoWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(124,58,237,0.16)",
    backgroundColor: "#222",
  },
  modalPhoto: { width: "100%", height: "100%" },

  modalName: { color: "#fff", fontSize: 18, fontWeight: "900" },
  modalSubtitle: { color: "#cfc6ff", fontSize: 12, marginTop: 4 },

  modalDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    marginVertical: 12,
    width: "100%",
  },

  infoRow: {
    marginBottom: 12,
    flexDirection: "column",
  },
  infoLabel: {
    color: "#bfb7ff",
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },

  modalFooter: {
    marginTop: 10,
    alignItems: "flex-end",
  },

  modalClose: {
    borderWidth: 1,
    borderColor: ACCENT,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalCloseText: { color: ACCENT, fontWeight: "800" },
});
