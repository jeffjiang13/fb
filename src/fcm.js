import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA_ZHzp7P760fCmy_r40qyVp-4pVyKaV_g",
  authDomain: "facebook-81c3c.firebaseapp.com",
  projectId: "facebook-81c3c",
  storageBucket: "facebook-81c3c.appspot.com",
  messagingSenderId: "1094313014969",
  appId: "1:1094313014969:web:8c3805f3068e0a284f8d68",
  measurementId: "G-9C907QG2NB"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
