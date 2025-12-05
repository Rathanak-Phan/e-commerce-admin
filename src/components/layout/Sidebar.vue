<template>
  <aside
    :class="[
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-2xl',
      'flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-xl'
    ]"
  >
    <!-- Logo -->
    <router-link to="/" class="p-6 border-b dark:border-gray-700">
      <h1 class="text-2xl font-bold text-indigo-600 text-center">Admin</h1>
    </router-link>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <router-link
        to="/"
        @click="closeSidebar"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
        :class="isActive('/') ? activeClass : inactiveClass"
      >
        <HomeIcon class="w-5 h-5" />
        <span>Dashboard</span>
      </router-link>

      <router-link
        to="/products"
        @click="closeSidebar"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
        :class="isActive('/products') ? activeClass : inactiveClass"
      >
        <CubeIcon class="w-5 h-5" />
        <span>Products</span>
      </router-link>

      <router-link
        to="/orders"
        @click="closeSidebar"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
        :class="isActive('/orders') ? activeClass : inactiveClass"
      >
        <ShoppingCartIcon class="w-5 h-5" />
        <span>Orders</span>
      </router-link>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 border-t dark:border-gray-700 space-y-3">
      <!-- Dark Mode Toggle -->
      <button
        @click="theme.toggle()"
        class="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <div class="flex items-center gap-3">
          <component :is="theme.isDark ? SunIcon : MoonIcon" class="w-5 h-5" />
          <span class="text-sm font-medium">
            {{ theme.isDark ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </div>
      </button>

      <!-- Logout Button -->
      <button
        @click="confirmLogout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useThemeStore } from '../../stores/themeStore'
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/solid'

// Props & Emits
defineProps({
  sidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close-sidebar', 'open-logout-modal'])

// Theme
const theme = useThemeStore()

// Route
const route = useRoute()

// Active route detection
const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Styles
const activeClass = 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
const inactiveClass = 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'

// Actions
const closeSidebar = () => emit('close-sidebar')
const confirmLogout = () => emit('open-logout-modal')
</script>