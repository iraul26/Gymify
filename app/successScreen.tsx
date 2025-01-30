import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SuccessScreen = () => {
  const router = useRouter();

  useEffect(() => {
    //redirect to home after 3 seconds
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => clearTimeout(timeout); //clear timeout if component unmounts
  }, []);

  return (
    <View style={styles.container}>
      {/* green checkmark */}
      <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
      {/* success text */}
      <Text style={styles.successText}>Account Successfully Registered!</Text>
      {/* redirect text */}
      <Text style={styles.redirectText}>You will be redirected shortly...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
  },
  redirectText: {
    fontSize: 16,
    color: "#A1A1A1",
    marginTop: 10,
  },
});

export default SuccessScreen;