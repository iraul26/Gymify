import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "./userContext";

export default function PrivacyPolicy() {
  const router = useRouter();
  const { isDarkMode } = useUser();

  return (
    <View style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
      {/* back arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color={isDarkMode ? "#FFFFFF" : "#000000"} />
      </TouchableOpacity>

      {/* title */}
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Privacy Policy</Text>

      {/* privacy policy */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          Your privacy is important to us. This Privacy Policy explains how Gymify collects, uses, and protects your personal information when you use our app.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>1. Information We Collect</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          {"\u2022"} Personal Information: Name, email address, username, and profile picture. {"\n"}
          {"\u2022"} Usage Data: Information about how you use the app, such as workout history and preferences. {"\n"}
          {"\u2022"} Device Information: Device type, operating system, and unique device identifiers.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>2. How We Use Your Information</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          {"\u2022"} Provide and improve our services. {"\n"}
          {"\u2022"} Personalize your experience. {"\n"}
          {"\u2022"} Communicate with you (e.g., respond to inquiries or send updates). {"\n"}
          {"\u2022"} Ensure the security of our app.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>3. Data Sharing</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          We do not sell or share your personal information with third parties except: {"\n"}
          {"\u2022"} With your consent. {"\n"}
          {"\u2022"} To comply with legal obligations. {"\n"}
          {"\u2022"} To protect our rights or the safety of others.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>4. Data Security</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>5. Your Rights</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          You have the right to: {"\n"}
          {"\u2022"} Access, update, or delete your personal information. {"\n"}
          {"\u2022"} Opt-out of receiving promotional communications. {"\n"}
          {"\u2022"} Withdraw consent for data processing. {"\n"}
          To exercise these rights, contact us at support@gymify.com.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>6. Children's Privacy</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          Gymify is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such data, we MAY delete it immediately.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>7. Changes to This Policy</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Your continued use of the app after changes constitutes acceptance of the updated policy.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>8. Contact Us</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          If you have any questions about this Privacy Policy, please contact us at support@gymify.com.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  darkMode: {
    backgroundColor: "black"
  },
  lightMode: {
    backgroundColor: "white"
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    textAlign: "center"
  },
  darkText: {
    color: "#FFFFFF"
  },
  lightText: {
    color: "#000000"
  },
  darkAccent: {
    color: "#BB86FC"
  },
  lightAccent: {
    color: "#6200EE"
  },
  content: {
    paddingBottom: 40
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10
  },
});