<!-- src/components/layout/Layout.vue -->
<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

    <!-- Mobile Menu Button -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
    >
      <Bars3Icon class="w-6 h-6" />
    </button>

    <!-- Sidebar -->
    <Sidebar
      :sidebar-open="sidebarOpen"
      @close-sidebar="sidebarOpen = false"
      @open-logout-modal="showLogoutModal = true"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header :admin-data="adminData" />

      <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition-opacity duration-300 ease-out"
            leave-active-class="transition-opacity duration-200 ease-in"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
            mode="out-in"
          >
            <component :is="Component" :key="$route.path" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Logout Modal -->
    <teleport to="body">
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showLogoutModal = false"
      >
        <div class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Confirm Logout</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            Are you sure you want to end your session?
          </p>
          <div class="flex justify-between gap-4">
            <button
              @click="showLogoutModal = false"
              class="px-6 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              @click="doLogout"
              class="px-6 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition shadow-lg"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'          // ← watch added here!
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { Bars3Icon } from '@heroicons/vue/24/solid'

const router = useRouter()
const authStore = useAuthStore()

// State
const sidebarOpen = ref(false)
const showLogoutModal = ref(false)

// Always fresh admin data
const adminData = computed(() => ({
  name: authStore.user?.displayName || authStore.user?.name || 'Admin',
  email: authStore.user?.email || 'admin@store.com',
  photoURL: authStore.user?.photoURL || null
}))

// Redirect to login if user becomes null (e.g. logout from another tab)
watch(
  () => authStore.user,
  (user) => {
    if (!user) {
      router.push('/login')
    }
  }
)

// Logout
const doLogout = async () => {
  await authStore.logout()
  showLogoutModal.value = false
  router.push('/login')
}
</script>