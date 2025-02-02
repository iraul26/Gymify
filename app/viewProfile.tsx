import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import db from "@/firebaseConfig";
import { useUser } from "./userContext";

export default function ViewProfile() {
  const router = useRouter();
  const { userId } = useUser();
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
    else {
        console.log("error: userId is undefined");
    }
  }, [userId]);

  //fetch user data from db
  const fetchUserData = async () => {
    try {
      const userRef = doc(db, "users", String(userId));
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color={isDarkMode ? "#FFF" : "#000"} />
      </TouchableOpacity>

      {/* title */}
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>View Profile</Text>

      {/* user data */}
      <View style={styles.inputContainer}>
        <TextInput value={userData?.firstName} editable={false} style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} />
        <TextInput value={userData?.lastName} editable={false} style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} />
        <TextInput value={userData?.username} editable={false} style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} />
        <TextInput value={userData?.email} editable={false} style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} />
      </View>

      {/* toggle theme */}
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleText, isDarkMode ? styles.darkText : styles.lightText]}>Toggle Light/Dark Theme</Text>
        <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} />
      </View>
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 100,
  },
  darkText: {
    color: "#FFF",
  },
  lightText: {
    color: "#000",
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  darkInput: {
    borderBottomColor: "#BBB",
    color: "#FFF",
  },
  lightInput: {
    borderBottomColor: "#333",
    color: "#000",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  toggleText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});

