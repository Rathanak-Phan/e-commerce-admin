// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Global Heroicons (solid)
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon
} from '@heroicons/vue/24/solid'

const app = createApp(App)

// Register icons globally
app.component('HomeIcon', HomeIcon)
app.component('CubeIcon', CubeIcon)
app.component('ShoppingCartIcon', ShoppingCartIcon)
app.component('SunIcon', SunIcon)
app.component('MoonIcon', MoonIcon)
app.component('ArrowRightOnRectangleIcon', ArrowRightOnRectangleIcon)
app.component('UserCircleIcon', UserCircleIcon)
app.component('Bars3Icon', Bars3Icon)

// Pinia
const pinia = createPinia()
app.use(pinia)

// CRITICAL: Initialize Firebase Auth listener BEFORE mounting
import { useAuthStore } from './stores/authStore'
const authStore = useAuthStore()
authStore.initAuth()   // ← Correct name!

// Router
app.use(router)

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "rathanak-phan-admin";
  }
});


// Mount app
app.mount('#app')