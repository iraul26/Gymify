import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getDocs, collection, query, where } from 'firebase/firestore';
import bcrypt from 'react-native-bcrypt';
import db from '@/firebaseConfig';

export default function Login() {
  //router hook for navigation
  const router = useRouter();
  //state variables for input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //method that will handle login validation and navigation
  const handleLogin = async () => {
    //start the spinner
    setIsLoading(true);

    //if username or password is empty, display an alert message
    if (!username.trim() || !password.trim()) {
      setIsLoading(false);
      Alert.alert('Validation Error', 'Username and password cannot be empty!');
      return;
    }

    try {
      //query the database to find a user with the entered username
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setIsLoading(false);
        Alert.alert('Invalid Login', 'Invalid username and/or password. Please try again.');
        return;
      }

      //retrieve user data and check the password
      const userData = querySnapshot.docs[0].data();
      const passwordMatch = bcrypt.compareSync(password, userData.password);

      if (passwordMatch) {
        //navigate to the home screen if login is successful
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Invalid Login', 'Invalid username and/or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
    finally {
      setIsLoading(false);
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
      
      {/* login button or spinner */}
      {isLoading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <TouchableOpacity onPress={handleLogin} style={{
              backgroundColor: '#007BFF',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              width: '100%',
            }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
        )}

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