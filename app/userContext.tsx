import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";

//define context type
interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
  logout: () => void;
}

//create context
const UserContext = createContext<UserContextType | undefined>(undefined);

//context provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); //default to dark mode
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  //fetch them when user logs in
  useEffect(() => {
    if(userId) {
      fetchUserTheme();
      setIsLoggedIn(true); //set user as logged in when they have a userId
    }
    else {
      setIsLoggedIn(false); //user is not logged in
    }
  }, [userId]);

  /**
   * fetch the users theme preference from firestore
   */
  const fetchUserTheme = async() => {
    try {
      const userRef = doc(db, "users", String(userId));
      const userSnap = await getDoc(userRef);

      if(userSnap.exists()) {
        const userTheme = userSnap.data()?.theme || "dark"; //default to dark
        setIsDarkMode(userTheme === "dark");
      }
    }
    catch(error) {
      console.error("error fetching theme: ", error);
    }
  }

  /**
   * toggle theme and update firestore
   */
  const toggleTheme = async() => {
    const newTheme = isDarkMode ? "light" : "dark";

    try {
      if(userId) {
        const userRef = doc(db, "users", String(userId));
        await updateDoc(userRef, { theme: newTheme });
      }
      setIsDarkMode(!isDarkMode); //update ui state
    }
    catch(error) {
      console.error("error updating theme: ", error);
    }
  };

  /**
   * logout method when user logs out
   */
  const logout = () => {
    setUserId(null);
    setIsLoggedIn(false);
    router.push("/"); //redirect to login page
  }

  return (
    <UserContext.Provider value={{ userId, setUserId, isDarkMode, toggleTheme, isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </UserContext.Provider>
  );
};

//hook to access user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};