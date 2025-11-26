// src/stores/authStore.js
import { defineStore } from "pinia";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: true,
  }),

  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
        this.loading = false;
      });
    },

    async login(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
    },

    async logout() {
      await signOut(auth);
      this.user = null;
    },
  },
});
