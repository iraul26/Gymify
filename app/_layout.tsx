import { NativeBaseProvider } from 'native-base';
import { Stack } from 'expo-router';
import { UserProvider } from './userContext';
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from 'react';

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
        <Stack>
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="successScreen" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="termsAndConditions" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profilePicture" options={{ headerShown: false }} />
          <Stack.Screen name="privacyPolicy" options={{ headerShown: false}} />
          <Stack.Screen name="viewProfile" options={{ headerShown: false}} />
        </Stack>
      </NativeBaseProvider>
    </UserProvider>
  );
}