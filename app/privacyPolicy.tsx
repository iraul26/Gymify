import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* back arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* title */}
      <Text style={styles.title}>Privacy Policy</Text>

      {/* privacy policy */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          Your privacy is important to us. This Privacy Policy explains how Gymify collects, uses, and protects your personal information when you use our app.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We may collect the following types of information:
          - Personal Information: Name, email address, username, and profile picture.
          - Usage Data: Information about how you use the app, such as workout history and preferences.
          - Device Information: Device type, operating system, and unique device identifiers.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use your information to:
          - Provide and improve our services.
          - Personalize your experience.
          - Communicate with you (e.g., respond to inquiries or send updates).
          - Ensure the security of our app.
        </Text>

        <Text style={styles.sectionTitle}>3. Data Sharing</Text>
        <Text style={styles.text}>
          We do not sell or share your personal information with third parties except:
          - With your consent.
          - To comply with legal obligations.
          - To protect our rights or the safety of others.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.text}>
          We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          - Access, update, or delete your personal information.
          - Opt-out of receiving promotional communications.
          - Withdraw consent for data processing.
          To exercise these rights, contact us at support@gymify.com.
        </Text>

        <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
        <Text style={styles.text}>
          Gymify is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such data, we will delete it immediately.
        </Text>

        <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Your continued use of the app after changes constitutes acceptance of the updated policy.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at support@gymify.com.
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