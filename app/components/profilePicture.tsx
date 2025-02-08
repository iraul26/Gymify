import React, { useEffect, useState, useCallback } from "react";
import { TouchableOpacity, Image as RNImage, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useFocusEffect } from "expo-router";
import { db } from "@/firebaseConfig";
import { useUser } from "@/app/userContext";

export default function ProfilePicture() {
  const { userId } = useUser();
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchProfilePicture();
    }
  }, [userId]);

  const fetchProfilePicture = async () => {
    try {
      const userRef = doc(db, "users", String(userId));
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setProfilePicture(userSnap.data().profilePicture || null);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if(userId) {
        fetchProfilePicture();
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
    top: 40, //adjust for safe area
    right: 16,
    zIndex: 1000, //ensure it stays on top
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BB86FC",
  },
});
