import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarStyle: { backgroundColor: "#121212" }, tabBarInactiveTintColor: "#888", headerStyle: { backgroundColor: "#121212" }, headerTintColor: "#fff"}}>

      {/* workout tab */}
      <Tabs.Screen name="workout" options={{ title: "Workout", tabBarIcon: ({ focused }) => ( <Image source={require("../../assets/images/dumbell.png")} style={{ width: 40,  height: 35}}/>)}}/>

      {/* home tab */}
      <Tabs.Screen name="home" options={{ title: "Meal Input", tabBarIcon: ({ focused }) => (<Image source={require("../../assets/images/mealInput.png")} style={{ width: 50, height: 35 }} />)}}/>

      {/* user tab */}
      <Tabs.Screen name="user" options={{ title: "Account", tabBarIcon: ({ focused }) => (<Image source={require("../../assets/images/user.png")} style={{ width: 40, height: 45 }} />)}}/>

    </Tabs>
  );
}