// src/firebase/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'   // ← ADD THIS LINE

const firebaseConfig = {
  apiKey: "AIzaSyBTJJjYIapB4QJy4L74TxDZ4C3UY4uyoMI",
  authDomain: "mad-project-338bf.firebaseapp.com",
  projectId: "mad-project-338bf",
  storageBucket: "mad-project-338bf.appspot.com",  // ← This enables Storage
  messagingSenderId: "1089043096930",
  appId: "1:1089043096930:web:9f4620a38e50bc6838783b"
}

const app = initializeApp(firebaseConfig)

// Export all
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)   // ← ADD THIS LINE