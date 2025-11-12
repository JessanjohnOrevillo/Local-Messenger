// screens/UsersScreen.js — wrapped with KeyboardAvoidingView
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Image, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { executeSqlAsync } from "../lib/db";

export default function UsersScreen({ navigation, route }) {
  const currentUser = route.params.user;
  const [users, setUsers] = useState([]);

  const loadUsers = useCallback(async () => {
    try {
      const res = await executeSqlAsync("SELECT id, username, profile_uri FROM users WHERE id != ? ORDER BY username COLLATE NOCASE;", [
        currentUser.id,
      ]);
      const arr = [];
      for (let i = 0; i < res.rows.length; i++) arr.push(res.rows.item(i));
      setUsers(arr);
    } catch (e) {
      console.log("loadUsers error:", e);
    }
  }, [currentUser.id]);

  useEffect(() => {
    navigation.setOptions({ title: `Hi, ${currentUser.username}` });
    const unsub = navigation.addListener("focus", loadUsers);
    loadUsers();
    return unsub;
  }, [navigation, loadUsers]);

  const logout = () => navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });

  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.userRow} onPress={() => navigation.navigate("Chat", { currentUser, otherUser: item })}>
      {item.profile_uri ? (
        <Image source={{ uri: item.profile_uri }} style={styles.avatarSmall} />
      ) : (
        <View style={styles.avatarSmallPlaceholder}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>{(item.username || "?").charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userSub}>Tap to chat</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} keyboardVerticalOffset={90}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Contacts</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>

        {users.length === 0 ? (
          <View style={styles.emptyWrap}><Text style={styles.emptyText}>No other users. Register another account to chat.</Text></View>
        ) : (
          <FlatList data={users} keyExtractor={(i) => `${i.id}`} renderItem={renderUser} contentContainerStyle={{ paddingBottom: 80 }} />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0b1a", padding: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  logout: { color: "#ff6b6b", fontWeight: "700" },
  userRow: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#150f2e", borderRadius: 12, marginBottom: 10 },
  avatarSmall: { width: 52, height: 52, borderRadius: 26 },
  avatarSmallPlaceholder: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#4b3675", alignItems: "center", justifyContent: "center" },
  userName: { color: "#fff", fontWeight: "700" },
  userSub: { color: "#a99ff8", fontSize: 12, marginTop: 2 },
  emptyWrap: { padding: 20, alignItems: "center" },
  emptyText: { color: "#888" },
});