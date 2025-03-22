import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../userContext";

export default function User() {
  const router = useRouter();
  const { userId, isDarkMode, logout } = useUser(); //get user context

  return (
    <View style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
      {/* my profile section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, isDarkMode ? styles.darkText : styles.lightText]}>My Profile</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: "/viewProfile", params: { userId } })} style={[styles.row, isDarkMode ? styles.darkRow : styles.lightRow]}>
          <Text style={[styles.rowText, isDarkMode ? styles.darkText : styles.lightText]}>View Profile</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#BB86FC" : "#6200EE"} />
        </TouchableOpacity>
      </View>

      {/* about section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, isDarkMode ? styles.darkText : styles.lightText]}>About</Text>
        <TouchableOpacity onPress={() => router.push("/termsAndConditions")} style={[styles.row, isDarkMode ? styles.darkRow : styles.lightRow]}>
          <Text style={[styles.rowText, isDarkMode ? styles.darkText : styles.lightText]}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#BB86FC" : "#6200EE"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/privacyPolicy")} style={[styles.row, isDarkMode ? styles.darkRow : styles.lightRow]}>
          <Text style={[styles.rowText, isDarkMode ? styles.darkText : styles.lightText]}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#BB86FC" : "#6200EE"} />
        </TouchableOpacity>
      </View>

      {/* logout button */}
      <TouchableOpacity onPress={logout} style={[styles.logoutButton, isDarkMode ? styles.darkLogout : styles.lightLogout]}>
        <Text style={[styles.logoutText, isDarkMode ? styles.lightText : styles.darkText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  darkMode: {
    backgroundColor: "black",
  },
  lightMode: {
    backgroundColor: "white",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  darkText: {
    color: "#FFF",
  },
  lightText: {
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  darkRow: {
    backgroundColor: "#1E1E1E",
  },
  lightRow: {
    backgroundColor: "#F5F5F5",
  },
  rowText: {
    fontSize: 16,
    color: "#FFF",
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  darkLogout: {
    backgroundColor: "red",
  },
  lightLogout: {
    backgroundColor: "#6200EE",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#121212",
  },
});