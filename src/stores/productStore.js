// src/stores/productStore.js
import { defineStore } from 'pinia'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false
  }),
  actions: {
    async fetchProducts() {
      this.loading = true
      const snapshot = await getDocs(collection(db, 'products'))
      this.products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      this.loading = false
    },
    async addProduct(product) {
      const docRef = await addDoc(collection(db, 'products'), product)
      this.products.push({ id: docRef.id, ...product })
    },
    async updateProduct(id, data) {
      await updateDoc(doc(db, 'products', id), data)
      const i = this.products.findIndex(p => p.id === id)
      if (i > -1) this.products[i] = { ...this.products[i], ...data }
    },
    async deleteProduct(id) {
      await deleteDoc(doc(db, 'products', id))
      this.products = this.products.filter(p => p.id !== id)
    }
  }
})