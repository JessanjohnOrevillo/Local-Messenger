// screens/ChatScreen.js — show username for each message + fixed keyboard handling
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { executeSqlAsync } from "../lib/db";

export default function ChatScreen({ navigation, route }) {
  const { currentUser, otherUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const flatListRef = useRef();

  const loadMessages = async () => {
    try {
      const res = await executeSqlAsync(
        `SELECT * FROM messages
         WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)
         ORDER BY created_at ASC;`,
        [currentUser.id, otherUser.id, otherUser.id, currentUser.id]
      );
      const arr = [];
      for (let i = 0; i < res.rows.length; i++) arr.push(res.rows.item(i));
      setMessages(arr);
      // small delay to allow layout, then scroll to end
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (e) {
      console.log("loadMessages error:", e);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: otherUser.username });
    const unsub = navigation.addListener("focus", loadMessages);
    loadMessages();
    return unsub;
  }, [navigation, currentUser.id, otherUser.id]);

  const sendNew = async (content) => {
    const ts = Date.now();
    await executeSqlAsync(
      `INSERT INTO messages (from_id, to_id, content, created_at) VALUES (?, ?, ?, ?);`,
      [currentUser.id, otherUser.id, content, ts]
    );
    await loadMessages();
  };

  const updateMessage = async (id, content) => {
    await executeSqlAsync(`UPDATE messages SET content = ? WHERE id = ?;`, [content, id]);
    setEditingId(null);
    await loadMessages();
  };

  const deleteMessage = async (id) => {
    await executeSqlAsync(`DELETE FROM messages WHERE id = ?;`, [id]);
    await loadMessages();
  };

  const onSendPress = async () => {
    const content = text.trim();
    if (!content) return;
    if (editingId) {
      await updateMessage(editingId, content);
    } else {
      await sendNew(content);
    }
    setText("");
  };

  const onLongPressMsg = (item) => {
    const options = [];
    if (item.from_id === currentUser.id) {
      options.push({
        text: "Edit",
        onPress: () => {
          setEditingId(item.id);
          setText(item.content);
        },
      });
      options.push({
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Delete message", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => deleteMessage(item.id) },
          ]);
        },
      });
    } else {
      options.push({
        text: "Copy",
        onPress: () => {
          // copy to clipboard (optional: implement if you want)
        },
      });
    }
    options.push({ text: "Cancel", style: "cancel" });
    Alert.alert("Message", "", options, { cancelable: true });
  };

  const renderItem = ({ item }) => {
    const mine = item.from_id === currentUser.id;
    const username = mine ? currentUser.username : otherUser.username;

    return (
      <View
        style={[
          styles.messageWrapper,
          mine ? styles.messageWrapperMine : styles.messageWrapperTheir,
        ]}
      >
        {/* Username label */}
        <Text style={[styles.username, mine ? styles.usernameMine : styles.usernameTheir]}>
          {username}
        </Text>

        {/* Message bubble */}
        <TouchableOpacity onLongPress={() => onLongPressMsg(item)} activeOpacity={0.85}>
          <View style={[styles.msgRow, mine ? styles.msgMine : styles.msgTheir]}>
            <Text style={styles.msgText}>{item.content}</Text>
            <Text style={styles.msgTime}>
              {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={90}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(i) => `${i.id}`}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 110 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.composerContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={editingId ? "Edit message..." : `Message ${otherUser.username}`}
            placeholderTextColor="#bbb"
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={onSendPress}>
            <Text style={styles.sendText}>{editingId ? "Update" : "Send"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0b1a" },

  /* wrapper around each message + username label */
  messageWrapper: {
    maxWidth: "100%",
    marginVertical: 6,
    paddingHorizontal: 6,
  },
  messageWrapperMine: { alignItems: "flex-end" },
  messageWrapperTheir: { alignItems: "flex-start" },

  /* username label */
  username: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: "700",
    letterSpacing: 0.2,
    opacity: 0.95,
  },
  usernameMine: { color: "#9ef0c9", textAlign: "right" },
  usernameTheir: { color: "#cfc6ff", textAlign: "left" },

  /* message bubble */
  msgRow: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 2,
  },
  msgMine: {
    backgroundColor: "#6ee7b7",
    marginLeft: "18%",
    alignSelf: "flex-end",
  },
  msgTheir: {
    backgroundColor: "#1a1625",
    borderColor: "#24152f",
    borderWidth: 1,
    marginRight: "18%",
    alignSelf: "flex-start",
  },

  msgText: { color: "#fff", fontSize: 15 },
  msgTime: {
    color: "#aaa",
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end",
  },

  composerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#150f2e",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#24152f",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#0f0b1a",
    borderRadius: 10,
    maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: "#9146ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 8,
  },
  sendText: { color: "#fff", fontWeight: "700" },
});
