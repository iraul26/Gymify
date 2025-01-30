import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Workout() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Tracker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
});
