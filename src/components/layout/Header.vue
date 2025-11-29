<!-- src/components/layout/Header.vue -->
<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ currentPageTitle }}
      </h2>

      <!-- CLICKABLE PROFILE AREA -->
      <div 
        class="flex items-center gap-4 cursor-pointer group select-none"
        @click="goToProfile"
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
          <img
            :src="userPhoto"
            alt="Profile"
            class="w-12 h-12 rounded-full ring-4 ring-indigo-100 dark:ring-indigo-900/50 object-cover shadow-md 
                   group-hover:ring-indigo-400 transition-all duration-300"
            @error="photoError = true"
          />
          <!-- Fallback Avatar (DiceBear) -->
          <div
            v-if="photoError || !userPhoto"
            class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-xl"
          >
            {{ userInitial }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'   // ← FIXED: Use @ alias!

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const photoError = ref(false)

// Click → Go to Profile
const goToProfile = () => {
  router.push('/profile')
}

// Real user data
const userName = computed(() => {
  return authStore.user?.displayName ||
         authStore.userProfile?.name ||
         authStore.user?.email?.split('@')[0] ||
         'Admin'
})

const userEmail = computed(() => authStore.user?.email || 'admin@store.com')
const userInitial = computed(() => (userName.value[0] || 'A').toUpperCase())

// FREE beautiful avatar (DiceBear)
const dicebearAvatar = computed(() => {
  const seed = (authStore.user?.email || 'admin').toLowerCase()
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=6366f1`
})

const userPhoto = computed(() => {
  if (photoError.value) return dicebearAvatar.value
  const photo = authStore.user?.photoURL || authStore.userProfile?.photoURL
  return photo || dicebearAvatar.value
})

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