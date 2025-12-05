// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Title } from "chart.js";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/auth/Login.vue"),
    meta: {
      title: "login | rathanak-phan-admin"
    }
  },

  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      title: "Dashboard | rathanak-phan-admin",
      requiresAdmin: true
    }
  },

  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Products.vue"),
    meta: {
      title: "Products | rathanak-phan-admin",
      requiresAdmin: true
    }
  },

  {
    path: "/orders",
    name: "Orders",
    component: () => import("../views/Orders.vue"),
    meta: {
      title: "Orders | rathanak-phan-admin",
      requiresAdmin: true
    }
  },

  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      title: "Profile | rathanak-phan-admin",
      requiresAuth: true
    }
  },

  // fallback
  {
    path: "/:catchAll(.*)",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Helper: wait for Firebase auth state to be known
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

// GLOBAL ROUTE GUARD — THE BEST WAY
router.beforeEach(async (to, from, next) => {
  // If a signed-in admin tries to visit /login, send them to dashboard
  if (to.path === "/login") {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().isAdmin === true) {
          next("/");
          return;
        }
      } catch (err) {
        console.error("Error checking admin status on /login redirect:", err);
        // allow to proceed to login on error
      }
    }
    // Not logged in or not admin → show login page
    next();
    return;
  }

  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (!requiresAdmin) {
    // Public pages
    next();
    return;
  }

  // For admin pages → ensure auth state is resolved first
  const user = await getCurrentUser();

  if (user) {
    // User is logged in → check if they are admin
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().isAdmin === true) {
        next(); // Allow access
      } else {
        next("/login"); // Not admin → kick out
      }
    } catch (err) {
      console.error("Error checking admin status:", err);
      next("/login");
    }
  } else {
    // Not logged in at all
    next("/login");
  }
});

export default router;
