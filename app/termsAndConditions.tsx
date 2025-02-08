import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* back arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* title */}
      <Text style={styles.title}>Terms and Conditions</Text>

      {/* terms and conditions */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          Welcome to Gymify! These Terms and Conditions govern your use of our app. By accessing or using Gymify, you agree to comply with these terms. If you do not agree, please do not use the app.
        </Text>

        <Text style={styles.sectionTitle}>1. User Responsibilities</Text>
        <Text style={styles.text}>
          - You must be at least 13 years old to use Gymify. If not, you may use Gymify services only with the involvement of a parent or guardian
          - You agree not to use the app for any illegal or unauthorized purpose.
          - You are responsible for maintaining the confidentiality of your account and password.
        </Text>

        <Text style={styles.sectionTitle}>2. Privacy Policy</Text>
        <Text style={styles.text}> Your use of Gymify is also governed by our Privacy Policy, which explains how we collect, use, and protect your data. Please review our <Text style={{color: "#A020F0"}} onPress={() => router.push("privacyPolicy")}>privacy policy here</Text></Text>

        <Text style={styles.sectionTitle}>3. Intellectual Property</Text>
        <Text style={styles.text}>
          All content, features, and functionality of Gymify (including but not limited to text, graphics, logos, and software) are owned by us or our licensors and are protected by copyright and other intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
        <Text style={styles.text}>
          Gymify is provided "as-is" without any warranties. We are not liable for any damages or losses resulting from your use of the app.
        </Text>

        <Text style={styles.sectionTitle}>5. Termination</Text>
        <Text style={styles.text}>
          We reserve the right to terminate or suspend your account if you violate these terms.
        </Text>

        <Text style={styles.sectionTitle}>6. Governing Law</Text>
        <Text style={styles.text}>
          These terms are governed by the laws of The United States Of America. Any disputes will be resolved in the courts of The United States Of America.
        </Text>

        <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
        <Text style={styles.text}>
          We may update these terms from time to time. Continued use of Gymify after changes constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about these terms, please contact us at support@gymify.com.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16
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
    color: "#FFFFFF",
    marginTop: 60,
    marginBottom: 20,
    textAlign: "center"
  },
  content: {
    paddingBottom: 40
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BB86FC",
    marginTop: 20,
    marginBottom: 10
  },
  text: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 10
  },
});