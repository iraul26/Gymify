import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function termsAndConditons() {

    //router to route back to previous screen
    const router = useRouter();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* back Arrow */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text>Terms and conditions mock page for now</Text>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 40,
      },
      backButton: {
        position: "absolute",
        top: 50,
        left: 16,
        zIndex: 1,
      }
});