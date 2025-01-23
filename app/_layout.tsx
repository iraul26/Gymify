import { NativeBaseProvider } from 'native-base';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <NativeBaseProvider>
      <Stack>
        <Stack.Screen name='register' options={{ headerShown: false }} />
        <Stack.Screen name="successScreen" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profilePicture" options={{ headerShown: false }} />
      </Stack>
    </NativeBaseProvider>
  );
}