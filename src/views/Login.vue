<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-indigo-600">EcomAdmin</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to manage your store</p>
      </div>

      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2">Email</label>
          <input v-model="email" type="email" required
            class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500" 
            placeholder="admin@yourstore.com" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <input v-model="password" type="password" required
            class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500" />
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2">
          <span v-if="loading" class="animate-spin">Loading...</span>
          <span v-else>Sign In</span>
        </button>

        <p v-if="error" class="text-red-600 text-center text-sm mt-4">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const email = ref('admin@yourstore.com')     // ← change or keep for testing
const password = ref('123456')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const auth = getAuth()

const login = async () => {
  loading.value = true
  error.value = ''
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
    
    if (userDoc.exists() && userDoc.data().isAdmin === true) {
      localStorage.setItem('adminAuthenticated', 'true')
      router.push('/')
    } else {
      auth.signOut()
      error.value = 'Access denied. Admins only.'
    }
  } catch (err) {
    error.value = 'Wrong email or password'
  } finally {
    loading.value = false
  }
}
</script>