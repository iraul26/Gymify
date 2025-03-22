import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "./userContext";

export default function TermsAndConditions() {
  const router = useRouter();
  const { isDarkMode } = useUser(); //get theme preference

  return (
    <View style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
      {/* back arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color={isDarkMode ? "#FFFFFF" : "#000000"}/>
      </TouchableOpacity>

      {/* title */}
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Terms and Conditions</Text>

      {/* terms and conditions */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          Welcome to Gymify! These Terms and Conditions govern your use of our app. By accessing or using Gymify, you agree to comply with these terms. If you do not agree, please do not use the app.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>
          1. User Responsibilities
        </Text>

        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          {"\u2022"} You must be at least 13 years old to use Gymify. If not, you may use Gymify services only with the involvement of a parent or guardian. {"\n"}
          {"\u2022"} You agree not to use the app for any illegal or unauthorized purpose. {"\n"}
          {"\u2022"} You are responsible for maintaining the confidentiality of your account and password.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>2. Privacy Policy</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>Your use of Gymify is also governed by our Privacy Policy. Please review our{" "}
          <Text 
            style={[styles.link, isDarkMode ? styles.darkLink : styles.lightLink]} 
            onPress={() => router.push("privacyPolicy")}
          >
            Privacy Policy here
          </Text>.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>3. Intellectual Property</Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          All content, features, and functionality of Gymify (including but not limited to text, graphics, logos, and software) are owned by us or our licensors and are protected by copyright and other intellectual property laws.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>
          4. Limitation of Liability
        </Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          Gymify is provided "as-is" without any warranties. We are not liable for damages or losses.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>
          5. Termination
        </Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          We reserve the right to suspend your account if you violate these terms.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>
          6. Governing Law
        </Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          These terms are governed by U.S. law.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>
          7. Changes to Terms
        </Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          We may update these terms from time to time. Continued use of Gymify after changes constitutes acceptance of the new terms.
        </Text>

        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkAccent : styles.lightAccent]}>
          8. Contact Us
        </Text>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          If you have any questions, please contact us at support@gymify.com.
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
    backgroundColor: "black",
  },
  lightMode: {
    backgroundColor: "white",
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
    color: "#FFFFFF",
  },
  lightText: {
    color: "#000000",
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
  darkAccent: {
    color: "#BB86FC",
  },
  lightAccent: {
    color: "#6200EE",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10
  },
  link: {
    fontSize: 14,
    fontWeight: "bold",
  },
  darkLink: {
    color: "#BB86FC",
  },
  lightLink: {
    color: "#6200EE",
  },
});