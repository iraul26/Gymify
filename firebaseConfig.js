import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import { getStorage } from "firebase/storage";

//access firebase config from app.config.js
const firebaseConfig = Constants.expoConfig?.extra?.firebaseConfig;

if (!firebaseConfig) {
  throw new Error("Firebase configuration is missing from app.config.js");
}

//initialize firebase app
const app = initializeApp(firebaseConfig);

//initialize firestore
const db = getFirestore(app);

//initialize storage
const storage = getStorage(app);

export { db, storage };
