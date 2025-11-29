// src/stores/authStore.js
import { defineStore } from 'pinia'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase' 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userProfile: null,
    loading: true
  }),

  actions: {
    async login(email, password) {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      this.user = cred.user
      await this.fetchUserProfile(cred.user.uid)
    },

    async logout() {
      await signOut(auth)
      this.user = null
      this.userProfile = null
    },

    async fetchUserProfile(uid) {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        this.userProfile = docSnap.data()
      } else {
        // Create default profile
        const defaultProfile = {
          name: this.user?.displayName || this.user?.email?.split('@')[0],
          role: 'admin',
          createdAt: new Date()
        }
        await setDoc(docRef, defaultProfile)
        this.userProfile = defaultProfile
      }
    },

    initAuth() {
      onAuthStateChanged(auth, async (user) => {
        this.user = user
        if (user) {
          await this.fetchUserProfile(user.uid)
        } else {
          this.userProfile = null
        }
        this.loading = false
      })
    }
  }
})