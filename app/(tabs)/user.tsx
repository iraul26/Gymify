import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../userContext";

export default function User() {
  const router = useRouter();
  const { userId } = useUser();

  return (
    <View style={styles.container}>
      {/* my profile section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>My Profile</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: "/viewProfile", params: { userId } })} style={styles.row}>
          <Text style={styles.rowText}>View Profile</Text>
          <Ionicons name="chevron-forward" size={24} color="#BB86FC" />
        </TouchableOpacity>
      </View>

      {/* about section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>About</Text>
        <TouchableOpacity onPress={() => router.push("/termsAndConditions")} style={styles.row}>
          <Text style={styles.rowText}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={24} color="#BB86FC" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/privacyPolicy")} style={styles.row}>
          <Text style={styles.rowText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={24} color="#BB86FC" />
        </TouchableOpacity>
      </View>

      {/* logout button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BB86FC",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowText: {
    fontSize: 16,
    color: "#FFF",
  },
  logoutButton: {
    backgroundColor: "#BB86FC",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#121212",
  },
});