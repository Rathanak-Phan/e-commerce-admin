// src/stores/orderStore.js
import { defineStore } from 'pinia'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    loading: false
  }),
  actions: {
    async fetchOrders() {
      this.loading = true
      const snapshot = await getDocs(collection(db, 'orders'))
      this.orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }))
      this.loading = false
    },
    async updateStatus(id, status) {
      await updateDoc(doc(db, 'orders', id), { status })
      const order = this.orders.find(o => o.id === id)
      if (order) order.status = status
    }
  }
})