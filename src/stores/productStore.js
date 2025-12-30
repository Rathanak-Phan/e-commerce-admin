// src/stores/productStore.js
import { defineStore } from 'pinia'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchProducts() {
      try {
        this.loading = true;
        this.error = null;
        console.log("Fetching products from Firestore...");
        const snapshot = await getDocs(collection(db, 'products'));
        console.log("Found", snapshot.docs.length, "products");
        this.products = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            // Ensure arrays exist
            colors: data.colors || [],
            sizes: data.sizes || [],
            images: data.images || []
          };
        });
      } catch (error) {
        this.error = error.message;
        console.error("❌ Error fetching products:", error);
        alert("Failed to load products: " + error.message);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async addProduct(product) {
      try {
        this.error = null;
        console.log("Adding product to Firestore...", product);
        
        // Add timestamp if not present
        const productToSave = {
          ...product,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, 'products'), productToSave);
        console.log("✅ Product added with ID:", docRef.id);
        
        this.products.push({ 
          id: docRef.id, 
          ...productToSave 
        });
        
        return docRef.id;
      } catch (error) {
        this.error = error.message;
        console.error("❌ Error adding product:", error);
        console.error("Error code:", error.code);
        throw error;
      }
    },
    
    async updateProduct(id, data) {
      try {
        this.error = null;
        console.log("Updating product:", id, data);
        
        const productRef = doc(db, 'products', id);
        await updateDoc(productRef, {
          ...data,
          updatedAt: new Date().toISOString()
        });
        
        const i = this.products.findIndex(p => p.id === id);
        if (i > -1) {
          this.products[i] = { ...this.products[i], ...data };
        }
        
        console.log("✅ Product updated");
      } catch (error) {
        this.error = error.message;
        console.error("❌ Error updating product:", error);
        throw error;
      }
    },
    
    async deleteProduct(id) {
      try {
        this.error = null;
        console.log("Deleting product:", id);
        
        await deleteDoc(doc(db, 'products', id));
        this.products = this.products.filter(p => p.id !== id);
        
        console.log("✅ Product deleted");
      } catch (error) {
        this.error = error.message;
        console.error("❌ Error deleting product:", error);
        throw error;
      }
    }
  }
})