import { Tabs } from 'expo-router';
import { Image, View, StyleSheet } from 'react-native';
import React from 'react';
import ProfilePicture from '../components/profilePicture';

export default function TabLayout() {
  return (
    <Tabs
      //make the pfp on the headers of each tab
      screenOptions={{ tabBarStyle: { backgroundColor: "#121212" }, tabBarInactiveTintColor: "#888", headerStyle: { backgroundColor: "#121212" }, headerTintColor: "#fff", headerRight: () => (<View style={styles.headerRight}><ProfilePicture /></View>),}}>

      {/* workout tab */}
      <Tabs.Screen name="workout" options={{ title: "Workout Log", tabBarIcon: ({ focused }) => ( <Image source={require("../../assets/images/dumbell.png")} style={{ width: 40,  height: 35}}/>)}}/>

      {/* home tab */}
      <Tabs.Screen name="home" options={{ title: "Meal Input", tabBarIcon: ({ focused }) => (<Image source={require("../../assets/images/mealInput.png")} style={{ width: 50, height: 35 }} />)}}/>

      {/* user tab */}
      <Tabs.Screen name="user" options={{ title: "Account", tabBarIcon: ({ focused }) => (<Image source={require("../../assets/images/user.png")} style={{ width: 40, height: 45 }} />)}}/>

    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    bottom: 55,
    zIndex: 1001,
  }
})