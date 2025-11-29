<!-- src/components/layout/Header.vue -->
<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ currentPageTitle }}
      </h2>

      <!-- CLICK ANYWHERE → GO TO /profile -->
      <div
        @click="goToProfile"
        class="flex items-center gap-4 cursor-pointer group select-none hover:bg-gray-50 dark:hover:bg-gray-700/50 px-4 py-3 rounded-2xl transition-all duration-200"
      >
        <div class="text-right">
          <p class="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 transition">
            {{ userName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            {{ userEmail }}
            <span class="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </p>
        </div>

        <div class="relative">
          <!-- KEY FIX: Add :key + @load to force refresh & clear error -->
          <img
            :key="userPhoto"
            :src="userPhoto"
            alt="Profile"
            class="w-12 h-12 rounded-full ring-4 ring-indigo-100 dark:ring-indigo-900/50 object-cover shadow-md group-hover:ring-indigo-400 transition-all duration-300"
            @error="handleImageError"
            @load="photoError = false"
          />
          <!-- Beautiful Fallback -->
          <div
            v-if="photoError"
            class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-xl shadow-lg"
          >
            {{ userInitial }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const photoError = ref(false)

// Click → Go to profile
const goToProfile = () => {
  router.push('/profile')
}

// User data
const userName = computed(() => {
  return (
    authStore.user?.displayName ||
    authStore.userProfile?.name ||
    authStore.user?.email?.split('@')[0] ||
    'Admin'
  )
})

const userEmail = computed(() => authStore.user?.email || 'admin@store.com')
const userInitial = computed(() => (userName.value[0] || 'A').toUpperCase())

// Free beautiful avatar (DiceBear)
const dicebearAvatar = computed(() => {
  const seed = (authStore.user?.email || 'admin').toLowerCase()
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=6366f1`
})

// FINAL PHOTO LOGIC — ALWAYS SHOWS CORRECT IMAGE
const userPhoto = computed(() => {
  const photo = authStore.user?.photoURL || authStore.userProfile?.photoURL
  return photo || dicebearAvatar.value
})

// CRITICAL: Reset error when photo changes (after upload/URL paste)
watch(
  () => authStore.userProfile?.photoURL,
  () => {
    photoError.value = false
  }
)

// Handle image load error
const handleImageError = () => {
  photoError.value = true
}

// Page title
const currentPageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/products': 'Products Management',
    '/orders': 'Orders Management',
    '/profile': 'My Profile'
  }
  return titles[route.path] || 'Admin Panel'
})
</script>