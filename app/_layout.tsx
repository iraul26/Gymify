import { NativeBaseProvider } from 'native-base';
import { Stack } from 'expo-router';
import { UserProvider } from './userContext';

export default function RootLayout() {
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