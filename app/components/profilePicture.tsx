import React, { useEffect, useState, useCallback } from "react";
import { TouchableOpacity, Image as RNImage, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useFocusEffect } from "expo-router";
import { db } from "@/firebaseConfig";
import { useUser } from "@/app/userContext";

export default function ProfilePicture() {
  const { userId } = useUser(); //get the user id from the context
  const router = useRouter(); //hook for navigating between screens
  const [profilePicture, setProfilePicture] = useState<string | null>(null); //state to store pfp

  /**
   * fetch the pfp when the user logs in
   */
  useEffect(() => {
    if (userId) {
      fetchProfilePicture();
    }
  }, [userId]);

  /**
   *fetch the pfp from firestore
   */
  const fetchProfilePicture = async () => {
    try {
      const userRef = doc(db, "users", String(userId)); //reference to the users document in db
      const userSnap = await getDoc(userRef); //fetch the document

      //if user exists, set the pfp
      if (userSnap.exists()) {
        setProfilePicture(userSnap.data().profilePicture || null);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  /**
   * re fetch when screen gains focus
   * this ensures the profile picture is updated on screen when changed
   */
  useFocusEffect(
    useCallback(() => {
      if(userId) {
        fetchProfilePicture(); //fetch profile picture when the screen comes into focus
      }
    }, [userId])
  );

  return (
    <TouchableOpacity
      onPress={() => router.push("/viewProfile")}
      style={styles.avatarContainer}
    >
      {profilePicture ? (
        <RNImage source={{ uri: profilePicture }} style={styles.avatar} />
      ) : (
        <Ionicons name="person-circle-outline" size={40} color="#BB86FC" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: "absolute",
    top: 40, //position below search bar
    right: 16, //top right
    zIndex: 1000, //ensure it stays on top
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, //pfp is circle
    borderWidth: 1,
    borderColor: "#BB86FC",
  },
});
