// src/stores/userStore.js
import { defineStore } from 'pinia'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: []
  }),
  actions: {
    async fetchUsers() {
      const snapshot = await getDocs(collection(db, 'users'))
      this.users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
    },
    async blockUser(uid, block) {
      await updateDoc(doc(db, 'users', uid), { disabled: block })
      const user = this.users.find(u => u.uid === uid)
      if (user) user.disabled = block
    }
  }
})