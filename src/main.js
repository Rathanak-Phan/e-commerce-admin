// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Import only the icons you need (solid style – filled icons)
import { 
  HomeIcon, 
  CubeIcon,        // Products/Package
  ShoppingCartIcon, 
  SunIcon, 
  MoonIcon, 
  ArrowRightOnRectangleIcon  // Logout
} from '@heroicons/vue/24/solid'

const app = createApp(App)

// Register them globally as components (use PascalCase names)
app.component('HomeIcon', HomeIcon)
app.component('CubeIcon', CubeIcon)
app.component('ShoppingCartIcon', ShoppingCartIcon)
app.component('SunIcon', SunIcon)
app.component('MoonIcon', MoonIcon)
app.component('ArrowRightOnRectangleIcon', ArrowRightOnRectangleIcon)

app.use(createPinia())
app.use(router)
app.mount('#app')