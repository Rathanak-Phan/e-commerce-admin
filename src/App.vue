<template>
  <div
    class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <!-- Mobile menu button -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
    >
      <Bars3Icon class="w-6 h-6" />
    </button>

    <!-- Sidebar -->
    <aside
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0"
    >
      <div class="p-6 border-b dark:border-gray-700">
        <h1 class="text-2xl font-bold text-indigo-600">EcomAdmin</h1>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1">
        <router-link
          to="/"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="isActive('/') ? activeClass : inactiveClass"
        >
          <HomeIcon class="w-5 h-5" />
          Dashboard
        </router-link>

        <router-link
          to="/products"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="isActive('/products') ? activeClass : inactiveClass"
        >
          <CubeIcon class="w-5 h-5" />
          Products
        </router-link>

        <router-link
          to="/orders"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          :class="isActive('/orders') ? activeClass : inactiveClass"
        >
          <ShoppingCartIcon class="w-5 h-5" />
          Orders
        </router-link>
      </nav>

      <div class="p-4 border-t dark:border-gray-700 space-y-2">
        <button
          @click="theme.toggle()"
          class="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span class="flex items-center gap-3">
            <component
              :is="theme.isDark ? SunIcon : MoonIcon"
              class="w-5 h-5"
            />
            {{ theme.isDark ? "Light Mode" : "Dark Mode" }}
          </span>
        </button>

        <button
          @click="confirmLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">{{ currentPageTitle }}</h2>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="font-medium">{{ adminData.name || "Admin" }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ adminData.email }}
                <span
                  class="inline-block w-2 h-2 bg-green-500 rounded-full ml-2"
                ></span>
              </p>
            </div>
            <img
              :src="
                adminData.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  adminData.name || 'A'
                )}&background=6366f1&color=fff`
              "
              alt="Admin"
              class="w-12 h-12 rounded-full ring-4 ring-indigo-100 dark:ring-indigo-900/50 object-cover"
            />
          </div>
        </div>
      </header>

      <main
        class="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50 dark:bg-gray-900"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Logout Confirm Modal -->
    <div
      v-if="showLogoutModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
      >
        <h3 class="text-lg font-bold mb-4">Confirm Logout</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to end your session?
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showLogoutModal = false"
            class="px-5 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="doLogout"
            class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";
import { useThemeStore } from "./stores/themeStore";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();
const route = useRoute();
const theme = useThemeStore();
const auth = getAuth();

const sidebarOpen = ref(false);
const showLogoutModal = ref(false);
const adminData = ref({
  name: "Loading...",
  email: "",
  photoURL: "",
});

const currentPageTitle = computed(() => {
  const titles = {
    "/": "Dashboard",
    "/products": "Products Management",
    "/orders": "Orders Management",
  };
  return titles[route.path] || "Admin Panel";
});

const isActive = (path) =>
  route.path === path || route.path.startsWith(path + "/");
const activeClass =
  "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium";
const inactiveClass =
  "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700";

const loadAdminData = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      adminData.value = docSnap.data();
    }
  } catch (err) {
    console.error("Failed to load admin:", err);
    adminData.value = { name: "Admin", email: "admin@store.com" };
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadAdminData(user.uid);
    } else {
      router.push("/login");
    }
  });

  if (theme.isDark) {
    document.documentElement.classList.add("dark");
  }
});

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const confirmLogout = () => {
  showLogoutModal.value = true;
};

const doLogout = async () => {
  try {
    await signOut(auth);
    showLogoutModal.value = false;
    router.push("/login");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
