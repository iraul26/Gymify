import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

//access firebase config from app.config.js
const firebaseConfig = Constants.expoConfig?.extra?.firebaseConfig;

if (!firebaseConfig) {
  throw new Error("Firebase configuration is missing from app.config.js");
}

//initialize firebase app
const app = initializeApp(firebaseConfig);

//initialize firestore
const db = getFirestore(app);

export default db;
