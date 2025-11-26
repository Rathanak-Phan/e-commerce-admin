// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/Products.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: { requiresAdmin: true }
  },
  // Add more admin routes here...
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GLOBAL ROUTE GUARD — THE BEST WAY
router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  if (!requiresAdmin) {
    // Public pages like /login
    next()
    return
  }

  // For admin pages → check Firebase auth + isAdmin flag
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    // User is logged in → check if they are admin
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists() && userDoc.data().isAdmin === true) {
          next() // Allow access
        } else {
          next('/login') // Not admin → kick out
        }
    } catch (err) {
      console.error('Error checking admin status:', err)
      next('/login')
    }
  } else {
    // Not logged in at all
    next('/login')
  }
})

export default router