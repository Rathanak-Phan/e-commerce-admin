<template>
  <div class="space-y-8">
    <!-- Stats Cards (same as before) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Revenue -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              ${{ stats.totalRevenue.toLocaleString() }}
            </p>
            <p class="text-sm text-green-600 mt-2">+12.5% from last month</p>
          </div>
          <div class="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
            <ChartBarIcon class="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Total Orders -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {{ stats.totalOrders }}
            </p>
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
            <ShoppingCartIcon class="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Total Products -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {{ stats.totalProducts }}
            </p>
          </div>
          <div class="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
            <CubeIcon class="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <!-- Active Users (now clickable!) -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 cursor-pointer hover:shadow-lg transition"
           @click="activeTab = 'users'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Active Customers</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {{ stats.activeCustomers }}
            </p>
            <p class="text-sm text-indigo-600 mt-2">Click to view all users</p>
          </div>
          <div class="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full">
            <UserGroupIcon class="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs: Recent Orders | Sales Chart | Users List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
      <!-- Tab Buttons -->
      <div class="flex border-b dark:border-gray-700">
        <button @click="activeTab = 'orders'"
          class="px-6 py-4 font-medium text-sm border-b-2 transition"
          :class="activeTab === 'orders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'">
          Recent Orders
        </button>
        <button @click="activeTab = 'chart'"
          class="px-6 py-4 font-medium text-sm border-b-2 transition"
          :class="activeTab === 'chart' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'">
          Sales Chart
        </button>
        <button @click="activeTab = 'users'"
          class="px-6 py-4 font-medium text-sm border-b-2 transition"
          :class="activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'">
          All Customers ({{ userStore.users.length }})
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Recent Orders -->
        <div v-if="activeTab === 'orders'">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th class="px-6 py-3 text-left">Order</th>
                  <th class="px-6 py-3 text-left">Customer</th>
                  <th class="px-6 py-3 text-left">Total</th>
                  <th class="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 text-sm">#{{ order.id.slice(0,8) }}</td>
                  <td class="px-6 py-4 text-sm">{{ order.userEmail }}</td>
                  <td class="px-6 py-4 text-sm font-medium">${{ order.total.toFixed(2) }}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 text-xs rounded-full font-medium"
                      :class="{
                        'bg-yellow-100 text-yellow-800': order.status === 'pending',
                        'bg-blue-100 text-blue-800': order.status === 'processing',
                        'bg-green-100 text-green-800': order.status === 'delivered'
                      }">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sales Chart -->
        <div v-if="activeTab === 'chart'">
          <canvas ref="salesChart" class="w-full h-80"></canvas>
        </div>

        <!-- Users List -->
        <div v-if="activeTab === 'users'">
          <div class="flex justify-between items-center mb-4">
            <input v-model="userSearch" placeholder="Search users..." class="px-4 py-2 border rounded-lg dark:bg-gray-700" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="user in filteredUsers" :key="user.uid"
              class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {{ user.email[0].toUpperCase() }}
                </div>
                <div>
                  <p class="font-semibold">{{ user.email }}</p>
                  <p class="text-sm text-gray-500">ID: {{ user.uid.slice(0,10) }}...</p>
                </div>
              </div>

              <div class="space-y-2 text-sm">
                <p>Total Orders: <strong>{{ user.totalOrders || 0 }}</strong></p>
                <p>Total Spent: <strong>${{ (user.totalSpent || 0).toFixed(2) }}</strong></p>
                <p>Last Login: <strong>{{ formatDate(user.lastLogin) }}</strong></p>
              </div>

              <div class="mt-4 flex gap-2">
                <button @click="blockUser(user)" 
                  class="flex-1 px-3 py-2 text-sm rounded-lg transition"
                  :class="user.disabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'">
                  {{ user.disabled ? 'Unblock' : 'Block' }}
                </button>
                <button class="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useOrderStore } from '../stores/orderStore'
import { useUserStore } from '../stores/userStore'  // ← NEW: User Store
import Chart from 'chart.js/auto'
import {
  ChartBarIcon, ShoppingCartIcon, CubeIcon, UserGroupIcon
} from '@heroicons/vue/24/solid'

const productStore = useProductStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

const salesChart = ref(null)
let chartInstance = null
const activeTab = ref('orders')
const userSearch = ref('')

// Stats
const stats = computed(() => {
  const deliveredRevenue = orderStore.orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const lowStock = productStore.products.filter(p => (p.stock || 0) < 10).length

  return {
    totalRevenue: Math.round(deliveredRevenue),
    totalOrders: orderStore.orders.length,
    totalProducts: productStore.products.length,
    activeCustomers: userStore.users.length,
    lowStock
  }
})

const recentOrders = computed(() => orderStore.orders.slice(0, 5))
const filteredUsers = computed(() => {
  return userStore.users.filter(u =>
    u.email.toLowerCase().includes(userSearch.value.toLowerCase())
  )
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'Never'
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return d.toLocaleDateString()
}

const blockUser = async (user) => {
  await userStore.blockUser(user.uid, !user.disabled)
}

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    orderStore.fetchOrders(),
    userStore.fetchUsers()  // ← Fetch all users
  ])

  // Chart setup...
  if (salesChart.value && activeTab.value === 'chart') {
    // same chart code as before
  }
})

onBeforeUnmount(() => {
  chartInstance?.destroy()
})
</script>