import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const profilePicture = ({ route }: { route: any }) => {
    const router = useRouter();
    const { userId } = route.params;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const storage = getStorage();

    const handleTakePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission Denied", "Camera access is required.");
          return;
        }
    
        const result = await ImagePicker.launchCameraAsync({ base64: true });
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri);
        }
      };

      const handlePickPhoto = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission Denied", "Gallery access is required.");
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri);
        }
      };

      const handleUpload = async () => {
        if (!selectedImage) {
          Alert.alert("Error", "Please select or take a photo.");
          return;
        }
    
        try {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
    
          const storageRef = ref(storage, `profilePictures/${userId}`);
          await uploadBytes(storageRef, blob);
    
          const downloadURL = await getDownloadURL(storageRef);
    
          //save the downloadURL to firestore in the users collection
          Alert.alert("Success", "Profile picture uploaded!");
          router.replace("/(tabs)/home"); //redirect to home
        } catch (error) {
          console.error("Error uploading image: ", error);
          Alert.alert("Error", "Failed to upload image.");
        }
      };

      const handleSkip = () => {
        //set default profile picture
        router.replace("/(tabs)/home");
      };

      return (
        <View style={styles.container}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" onPress={() => router.back()} style={styles.backButton} />
          <Image source={require("../assets/images/logoExample.png")} style={styles.logo} />
          <Text style={styles.title}>Register</Text>
    
          <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
            <Ionicons name="camera-outline" size={40} color="#BB86FC" />
            <Text style={styles.actionText}>Take photo with camera</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.actionButton} onPress={handlePickPhoto}>
            <Ionicons name="image-outline" size={40} color="#BB86FC" />
            <Text style={styles.actionText}>Upload photo from your phone</Text>
          </TouchableOpacity>
    
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#121212",
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        },
        backButton: {
          position: "absolute",
          top: 50,
          left: 16,
        },
        logo: {
          width: 120,
          height: 120,
          marginBottom: 20,
        },
        title: {
          fontSize: 28,
          fontWeight: "bold",
          color: "#FFFFFF",
          marginBottom: 20,
        },
        actionButton: {
          alignItems: "center",
          marginVertical: 10,
        },
        actionText: {
          color: "#A1A1A1",
          marginTop: 10,
        },
        buttonsContainer: {
          flexDirection: "row",
          marginTop: 20,
        },
        uploadButton: {
          backgroundColor: "#BB86FC",
          padding: 12,
          borderRadius: 8,
          marginRight: 10,
        },
        uploadText: {
          color: "#121212",
          fontWeight: "bold",
        },
        skipButton: {
          backgroundColor: "#333333",
          padding: 12,
          borderRadius: 8,
        },
        skipText: {
          color: "#FFFFFF",
          fontWeight: "bold",
        },
    });

export default profilePicture;