// lib/db.js
// Fallback DB helper: use expo-sqlite if available; otherwise use AsyncStorage
import { Platform } from "react-native";

let SQLite = null;
try {
  SQLite = require("expo-sqlite");
} catch (e) {
  SQLite = null;
}

import AsyncStorage from "@react-native-async-storage/async-storage";

let usingSqlite = false;
let db = null;

let users = [];
let messages = [];
let nextUserId = 1;
let nextMessageId = 1;

async function loadFallbackData() {
  try {
    const u = await AsyncStorage.getItem("@messenger_users");
    const m = await AsyncStorage.getItem("@messenger_messages");
    users = u ? JSON.parse(u) : [];
    messages = m ? JSON.parse(m) : [];
    nextUserId = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
    nextMessageId = messages.length ? Math.max(...messages.map((x) => x.id)) + 1 : 1;
  } catch (err) {
    users = [];
    messages = [];
    nextUserId = 1;
    nextMessageId = 1;
  }
}

async function persistFallback() {
  try {
    await AsyncStorage.setItem("@messenger_users", JSON.stringify(users));
    await AsyncStorage.setItem("@messenger_messages", JSON.stringify(messages));
  } catch (e) {
    console.warn("Failed to persist fallback DB:", e);
  }
}

export function initDb() {
  if (SQLite && typeof SQLite.openDatabase === "function") {
    try {
      db = SQLite.openDatabase("messenger.db");
      usingSqlite = true;
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            profile_uri TEXT,
            created_at INTEGER
          );`
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_id INTEGER,
            to_id INTEGER,
            content TEXT,
            created_at INTEGER
          );`
        );
      });
      console.log("[lib/db] Initialized with expo-sqlite");
      return;
    } catch (e) {
      console.warn("[lib/db] sqlite init failed, falling back to AsyncStorage", e);
      usingSqlite = false;
    }
  }

  usingSqlite = false;
  loadFallbackData().then(() => {
    console.log("[lib/db] Using AsyncStorage fallback (no native sqlite available)");
  });
}

// Public wrapper — executes arbitrary SQL when using sqlite.
// The fallback implements only the SQL patterns the app uses.
export function executeSqlAsync(sql, params = []) {
  if (usingSqlite && db) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  return new Promise(async (resolve, reject) => {
    if (!users) await loadFallbackData();
    const sqlLow = (sql || "").trim().toLowerCase();

    try {
      // INSERT INTO users
      if (sqlLow.startsWith("insert into users")) {
        const [username, password, profile_uri, created_at] = params;
        if (users.find((u) => u.username === username)) {
          const error = new Error("UNIQUE constraint failed: users.username");
          reject(error);
          return;
        }
        const newUser = { id: nextUserId++, username, password, profile_uri: profile_uri || null, created_at: created_at || Date.now() };
        users.push(newUser);
        await persistFallback();
        resolve({ rows: { length: 0, item: () => null }, insertId: newUser.id, rowsAffected: 1 });
        return;
      }

      // SELECT user by credentials
      if (sqlLow.includes("from users") && sqlLow.includes("where username = ? and password = ?")) {
        const [username, password] = params;
        const found = users.filter((u) => u.username === username && u.password === password);
        const rows = found.map((u) => ({ id: u.id, username: u.username, profile_uri: u.profile_uri }));
        resolve({ rows: { length: rows.length, item: (i) => rows[i] } });
        return;
      }

      // SELECT users excluding current
      if (sqlLow.includes("from users") && sqlLow.includes("where id != ?")) {
        const [id] = params;
        const rows = users
          .filter((u) => u.id !== id)
          .sort((a, b) => (a.username || "").localeCompare(b.username || ""))
          .map((u) => ({ id: u.id, username: u.username, profile_uri: u.profile_uri }));
        resolve({ rows: { length: rows.length, item: (i) => rows[i] } });
        return;
      }

      // INSERT into messages
      if (sqlLow.startsWith("insert into messages")) {
        const [from_id, to_id, content, created_at] = params;
        const newMsg = { id: nextMessageId++, from_id, to_id, content, created_at: created_at || Date.now() };
        messages.push(newMsg);
        await persistFallback();
        resolve({ rows: { length: 0, item: () => null }, insertId: newMsg.id, rowsAffected: 1 });
        return;
      }

      // SELECT messages between users
      if (sqlLow.includes("from messages") && sqlLow.includes("order by created_at asc")) {
        const [a1, b1, a2, b2] = params;
        const rows = messages
          .filter((m) => (m.from_id === a1 && m.to_id === b1) || (m.from_id === a2 && m.to_id === b2))
          .sort((x, y) => (x.created_at || 0) - (y.created_at || 0));
        resolve({ rows: { length: rows.length, item: (i) => rows[i] } });
        return;
      }

      // DELETE message by id
      if (sqlLow.startsWith("delete from messages where id =")) {
        const [id] = params;
        const before = messages.length;
        messages = messages.filter((m) => m.id !== id);
        await persistFallback();
        const after = messages.length;
        resolve({ rowsAffected: before - after });
        return;
      }

      // UPDATE message content
      if (sqlLow.startsWith("update messages set content =")) {
        const [content, id] = params;
        let found = false;
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].id === id) {
            messages[i].content = content;
            found = true;
            break;
          }
        }
        await persistFallback();
        resolve({ rowsAffected: found ? 1 : 0 });
        return;
      }

      reject(new Error("Unsupported SQL in fallback: " + sql));
    } catch (err) {
      reject(err);
    }
  });
}