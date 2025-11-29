<template>
  <div class="space-y-8 pb-10">
    <!-- ==================== STATS CARDS ==================== -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Total Revenue
            </p>
            <p class="text-3xl font-bold mt-2">
              ${{ stats.totalRevenue.toLocaleString() }}
            </p>
            <p class="text-sm text-green-600 mt-2">+12.5% from last month</p>
          </div>
          <div class="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
            <ChartBarIcon class="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            <p class="text-3xl font-bold mt-2">{{ stats.totalOrders }}</p>
          </div>
          <div class="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <ShoppingCartIcon class="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Total Products
            </p>
            <p class="text-3xl font-bold mt-2">{{ stats.totalProducts }}</p>
          </div>
          <div class="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <CubeIcon class="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Active Customers
            </p>
            <p class="text-3xl font-bold mt-2">{{ stats.activeCustomers }}</p>
          </div>
          <div class="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <UserGroupIcon class="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MAIN TABS ==================== -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 overflow-hidden"
    >
      <div class="flex border-b dark:border-gray-700">
        <button
          @click="activeTab = 'orders'"
          :class="tabClass('orders')"
          class="transition-all"
        >
          Recent Orders
        </button>
        <button
          @click="activeTab = 'chart'"
          :class="tabClass('chart')"
          class="transition-all"
        >
          Sales Analytics
        </button>
        <button
          @click="activeTab = 'users'"
          :class="tabClass('users')"
          class="transition-all"
        >
          Customers
          <span
            class="ml-2 px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-medium"
          >
            {{ userStore.users.length }}
          </span>
        </button>
      </div>

      <div class="p-6">
        <!-- RECENT ORDERS -->
        <div v-if="activeTab === 'orders'">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Order ID
                  </th>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Customer
                  </th>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Date
                  </th>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Total
                  </th>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="order in recentOrders"
                  :key="order.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td class="px-6 py-4 font-medium">
                    #{{ order.id.slice(-8) }}
                  </td>
                  <td class="px-6 py-4">{{ order.userEmail || "Guest" }}</td>
                  <td class="px-6 py-4">{{ formatDate(order.createdAt) }}</td>
                  <td class="px-6 py-4 font-semibold">
                    ${{ order.total?.toFixed(2) || "0.00" }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-3 py-1 text-xs rounded-full font-medium"
                      :class="statusColor(order.status)"
                    >
                      {{ order.status || "pending" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              v-if="recentOrders.length === 0"
              class="text-center py-12 text-gray-500"
            >
              No orders yet.
            </p>
          </div>
        </div>

        <!-- SALES ANALYTICS - UPGRADED CHART -->
        <div v-if="activeTab === 'chart'" class="h-96 -mx-6 -mb-6">
          <canvas ref="chartCanvas"></canvas>
        </div>

        <!-- CUSTOMERS LIST - FULLY EDITABLE -->
        <div v-if="activeTab === 'users'">
          <div class="mb-6 flex justify-end">
            <input
              v-model="searchQuery"
              placeholder="Search by name or email..."
              class="px-4 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    User
                  </th>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="user in filteredUsers"
                  :key="user.uid"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td class="px-6 py-4">
                    <div
                      v-if="editingId === user.uid"
                      class="flex items-center gap-3"
                    >
                      <input
                        v-model="editName"
                        @keyup.enter="saveName(user)"
                        @blur="cancelEdit"
                        class="px-3 py-2 border rounded-lg dark:bg-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none w-40"
                        ref="editInput"
                      />
                      <button
                        @click="saveName(user)"
                        class="text-green-600 text-sm font-medium"
                      >
                        Save
                      </button>
                    </div>
                    <div v-else class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md"
                      >
                        {{
                          (user.name || user.email[0]).charAt(0).toUpperCase()
                        }}
                      </div>
                      <span class="font-medium">{{
                        user.name || user.email.split("@")[0]
                      }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-3 py-1 text-xs rounded-full font-medium"
                      :class="
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-600'
                      "
                    >
                      {{ user.isAdmin ? "Admin" : "Customer" }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-3 py-1 text-xs rounded-full font-medium"
                      :class="
                        user.disabled
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30'
                      "
                    >
                      {{ user.disabled ? "Blocked" : "Active" }}
                    </span>
                  </td>
                  <td class="px-6 py-4 space-x-3">
                    <button
                      @click="startEdit(user)"
                      class="text-indigo-600 hover:underline text-sm font-medium"
                    >
                      Edit Name
                    </button>
                    <button
                      @click="toggleBlock(user)"
                      :class="user.disabled ? 'text-green-600' : 'text-red-600'"
                      class="hover:underline text-sm font-medium"
                    >
                      {{ user.disabled ? "Unblock" : "Block" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import Chart from "chart.js/auto";
import { useOrderStore } from "../stores/orderStore";
import { useProductStore } from "../stores/productStore";
import { useUserStore } from "../stores/userStore";
import {
  ChartBarIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/solid";

// Stores
const orderStore = useOrderStore();
const productStore = useProductStore();
const userStore = useUserStore();

// State
const chartCanvas = ref(null);
const activeTab = ref("orders");
const searchQuery = ref("");
const editingId = ref(null);
const editName = ref("");
const editInput = ref(null);
let chart = null;

// Stats
const stats = computed(() => {
  const deliveredRevenue = orderStore.orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    totalRevenue: Math.round(deliveredRevenue),
    totalOrders: orderStore.orders.length,
    totalProducts: productStore.products.length,
    activeCustomers: userStore.users.filter((u) => !u.disabled).length,
  };
});

const recentOrders = computed(() =>
  [...orderStore.orders]
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    .slice(0, 8)
);

const filteredUsers = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return userStore.users.filter(
    (u) =>
      u.email.toLowerCase().includes(q) ||
      (u.name || "").toLowerCase().includes(q)
  );
});

// Helpers
const formatDate = (ts) => {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusColor = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/30",
  };
  return map[status] || "bg-gray-100 text-gray-700 dark:bg-gray-600";
};

const tabClass = (tab) =>
  activeTab.value === tab
    ? "px-8 py-4 font-semibold text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20"
    : "px-8 py-4 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700";

// User Actions
const startEdit = (user) => {
  editingId.value = user.uid;
  editName.value = user.name || "";
  nextTick(() => editInput.value?.focus());
};

const saveName = async (user) => {
  const newName = editName.value.trim();
  if (newName && newName !== user.name) {
    await userStore.updateUser(user.uid, { name: newName });
  }
  editingId.value = null;
};

const cancelEdit = () => {
  editingId.value = null;
};

const toggleBlock = async (user) => {
  await userStore.blockUser(user.uid, !user.disabled);
};

// Chart - UPGRADED
onMounted(async () => {
  await Promise.all([
    orderStore.fetchOrders(),
    productStore.fetchProducts(),
    userStore.fetchUsers(),
  ]);

  if (chartCanvas.value) createChart();
});

const createChart = () => {
  const ctx = chartCanvas.value.getContext("2d");
  const monthly = Array(12).fill(0);

  orderStore.orders.forEach((order) => {
    if (order.status === "delivered" && order.createdAt) {
      const month = order.createdAt.toDate().getMonth();
      monthly[month] += order.total || 0;
    }
  });

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Revenue",
          data: monthly,
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#6366f1",
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => "$" + ctx.parsed.y.toLocaleString() },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.05)" },
          ticks: { callback: (v) => "$" + v.toLocaleString() },
        },
        x: { grid: { display: false } },
      },
    },
  });
};

onBeforeUnmount(() => chart?.destroy());
</script>
