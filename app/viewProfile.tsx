import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Switch, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import { useUser } from "./userContext";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ViewProfile() {
  const router = useRouter();
  const { userId } = useUser();
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
    else {
        console.log("error: userId is undefined");
    }
  }, [userId]);

  //fetch user data from db
  const fetchUserData = async () => {
    try {
      const userRef = doc(db, "users", String(userId));
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
        setProfilePicture(userSnap.data()?.profilePicture || null);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  //choose an image
  const selectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Gallery access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, allowsEditing: true });
    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  //method to take a photo
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ base64: true, allowsEditing: true });
    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  //method to upload the image to database
  const handleImageUpload = async (imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${userId}.jpg`);
      
      await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
      const downloadURL = await getDownloadURL(storageRef);

      // Update the profile picture in Firestore
      const userRef = doc(db, "users", String(userId));
      await updateDoc(userRef, { profilePicture: downloadURL });

      setProfilePicture(downloadURL);
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color={isDarkMode ? "#FFF" : "#000"} />
      </TouchableOpacity>

      {/* title */}
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>View Profile</Text>

      {/* Profile Picture */}
      <TouchableOpacity onPress={selectImage} style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : (
          <Ionicons name="person-circle-outline" size={100} color="#BB86FC" />
        )}
      </TouchableOpacity>

      {/* upload or take photo buttons */}
      <View style={styles.uploadContainer}>
        <TouchableOpacity onPress={selectImage} style={styles.uploadButton}>
          <Text style={styles.uploadText}>Choose Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto} style={styles.uploadButton}>
          <Text style={styles.uploadText}>Take Photo</Text>
        </TouchableOpacity>
      </View>


      {/* user data */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput value={userData?.firstName} editable={false} style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} />

        <Text style={styles.label}>Last Name</Text>
        <TextInput value={userData?.lastName} editable={false} style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} />

        <Text style={styles.label}>Username</Text>
        <TextInput value={userData?.username} editable={false} style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} />

        <Text style={styles.label}>Email Address</Text>
        <TextInput value={userData?.email} editable={false} style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} />
      </View>

      {/* toggle theme */}
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleText, isDarkMode ? styles.darkText : styles.lightText]}>Toggle Light/Dark Theme</Text>
        <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} />
      </View>
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 100,
  },
  profilePictureContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#BB86FC",
  },
  uploadContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  uploadButton: {
    backgroundColor: "#BB86FC",
    padding: 10,
    borderRadius: 8,
  },
  uploadText: {
    color: "#121212",
    fontWeight: "bold",
  },
  darkText: {
    color: "#FFF",
  },
  lightText: {
    color: "#000",
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  darkInput: {
    borderBottomColor: "#BBB",
    color: "#FFF",
  },
  lightInput: {
    borderBottomColor: "#333",
    color: "#000",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  toggleText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#BB86FC",
    alignSelf: "flex-start",
  }
});

