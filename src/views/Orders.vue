<template>
  <div class="space-y-6">
    <!-- Header + Search -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by email or order ID..."
          class="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
        />
        <select
          v-model="statusFilter"
          class="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="orderStore.loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading orders...</p>
    </div>

    <!-- Orders Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order ID</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="order in paginatedOrders"
              :key="order.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td class="px-6 py-4 text-sm font-medium">#{{ order.id.slice(0, 8) }}</td>
              <td class="px-6 py-4 text-sm">{{ order.userEmail || 'Guest' }}</td>
              <td class="px-6 py-4 text-sm">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 text-sm font-semibold">${{ order.total.toFixed(2) }}</td>
              <td class="px-6 py-4">
                <select
                  v-model="order.status"
                  @change="orderStore.updateStatus(order.id, order.status)"
                  class="px-3 py-1 text-sm rounded-full border-0 font-medium"
                  :class="statusClass(order.status)"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <button
                  @click="openOrderDetails(order)"
                  class="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="text-center py-12">
          <ShoppingCartIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">No orders found.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredOrders.length > itemsPerPage" class="px-6 py-4 border-t dark:border-gray-700 flex justify-between items-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} of {{ filteredOrders.length }} orders
        </p>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === 1 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 hover:bg-gray-50'"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage * itemsPerPage >= filteredOrders.length"
            class="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage * itemsPerPage >= filteredOrders.length ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 hover:bg-gray-50'"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-2xl font-bold">Order Details #{{ selectedOrder.id.slice(0, 8) }}</h2>
          <button @click="selectedOrder = null" class="text-gray-500 hover:text-gray-700">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Customer</p>
              <p class="font-medium">{{ selectedOrder.userEmail || 'Guest' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Date</p>
              <p class="font-medium">{{ formatDate(selectedOrder.createdAt) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <span class="inline-block px-3 py-1 text-sm rounded-full font-medium" :class="statusClass(selectedOrder.status)">
                {{ selectedOrder.status }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p class="text-2xl font-bold">${{ selectedOrder.total.toFixed(2) }}</p>
            </div>
          </div>

          <div>
            <h3 class="font-semibold mb-3">Order Items</h3>
            <div class="space-y-3">
              <div v-for="item in selectedOrder.items" :key="item.productId" class="flex justify-between items-center py-3 border-b dark:border-gray-700">
                <div>
                  <p class="font-medium">{{ item.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Qty: {{ item.qty }}</p>
                </div>
                <p class="font-medium">${{ (item.price * item.qty).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedOrder.address" class="pt-4 border-t dark:border-gray-700">
            <h3 class="font-semibold mb-2">Shipping Address</h3>
            <p class="text-gray-700 dark:text-gray-300">{{ selectedOrder.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '../stores/orderStore'
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/vue/24/solid'

const orderStore = useOrderStore()

// Filters
const searchQuery = ref('')
const statusFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Modal
const selectedOrder = ref(null)

// Fetch on mount
onMounted(() => orderStore.fetchOrders())

// Filtered & Searched Orders
const filteredOrders = computed(() => {
  return orderStore.orders.filter(order => {
    const matchesSearch = 
      (order.userEmail?.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      order.id.includes(searchQuery.value)
    const matchesStatus = !statusFilter.value || order.status === statusFilter.value
    return matchesSearch && matchesStatus
  }).sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
})

// Paginated
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredOrders.value.slice(start, start + itemsPerPage)
})

// Helpers
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusClass = (status) => {
  return {
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': status === 'pending',
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': status === 'processing',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300': status === 'shipped',
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': status === 'delivered'
  }
}

const openOrderDetails = (order) => {
  selectedOrder.value = order
}
</script>