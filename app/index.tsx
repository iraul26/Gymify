import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  //router hook for navigation
  const router = useRouter();

  //state variables for input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //method that will handle login validation and navigation
  const handleLogin = () => {
    //if username or password is empty, display an alert message
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Username and password cannot be empty!');
    } else {
      //navigate to the tabs screen
      router.replace("/(tabs)/home");
    }
  };

  return (
    //touchable without feedback is used when tapping outside of fields to dismiss keyboard
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: "#121212", paddingBottom: 200 }}>
      {/* heading */}
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 10, color: "#F7F6F5"}}>
        Gymify
      </Text>

      {/* logo */}
      <Image source={require("../assets/images/logoExample.png")} style={{ width: 150, height: 150, marginBottom: 20 }} resizeMode='contain' />

      {/* title */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: "#F7F6F5" }}>Login</Text>

      {/* username input */}
      <TextInput placeholder="Username" placeholderTextColor="#999" value={username} onChangeText={setUsername} style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          color: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      {/* password input */}
      <TextInput placeholder="Password" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          color: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
      
      {/* login button */}
      <TouchableOpacity onPress={handleLogin} style={{
          backgroundColor: '#007BFF',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          width: '100%',
        }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>
      </TouchableOpacity>

      {/* register link */}
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={{ color: "#fff", fontSize: 14, paddingTop: 10 }}>
          Don't have an account? <Text style={{ fontWeight: "bold"}}>Register here</Text>
        </Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
}