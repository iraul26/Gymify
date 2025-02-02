import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Home() {
  const { userId } = useLocalSearchParams();
  console.log("user id received in home: ", userId);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Meal Input</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    position: "absolute",
    top: 50,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff"
  },
});
