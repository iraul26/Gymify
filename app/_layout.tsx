import { NativeBaseProvider } from 'native-base';
import { Stack } from 'expo-router';
import { UserProvider, useUser } from './userContext';
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from 'react';
import { View, StyleSheet } from "react-native";

/**
 * seperate component to use useUser
 */
function AppLayout() {
  const { isDarkMode } = useUser(); //get the theme

  return (
    <View style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
      <Stack>
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="successScreen" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="termsAndConditions" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profilePicture" options={{ headerShown: false }} />
        <Stack.Screen name="privacyPolicy" options={{ headerShown: false }} />
        <Stack.Screen name="viewProfile" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  //lock the app in portrait mode
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
    lockOrientation();
  }, []);
  
  return (
    <UserProvider>
      <NativeBaseProvider>
        <AppLayout />
      </NativeBaseProvider>
    </UserProvider>
  );

}

//styles for global theme application
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkMode: {
    backgroundColor: "black",
  },
  lightMode: {
    backgroundColor: "white",
  },
});