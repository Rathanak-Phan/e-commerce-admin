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
            <p
              v-if="stats.revenueChange >= 0"
              class="text-sm text-green-600 mt-2"
            >
              +{{ stats.revenueChange.toFixed(1) }}% from last month
            </p>
            <p v-else class="text-sm text-red-600 mt-2">
              {{ stats.revenueChange.toFixed(1) }}% from last month
            </p>
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
            <p class="text-sm text-blue-600 mt-2">
              {{ stats.pendingOrders }} pending
            </p>
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
            <p class="text-sm text-purple-600 mt-2">
              {{ stats.lowStockProducts }} low stock
            </p>
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
            <p class="text-sm text-indigo-600 mt-2">
              {{ stats.newCustomers }} new this month
            </p>
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
                  <th
                    class="px-6 py-4 text-left font-medium text-gray-500 uppercase"
                  >
                    Actions
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
                  <td class="px-6 py-4">
                    <button
                      @click="updateOrderStatus(order)"
                      class="text-indigo-600 hover:underline text-sm font-medium"
                    >
                      Update
                    </button>
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
          <div class="mb-6 flex justify-between items-center">
            <input
              v-model="searchQuery"
              placeholder="Search by name or email..."
              class="px-4 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition w-64"
            />
            <button
              @click="refreshData"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
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
                  :key="user.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td class="px-6 py-4">
                    <div
                      v-if="editingId === user.id"
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
                          (user.name || user.email?.[0] || "U")
                            .charAt(0)
                            .toUpperCase()
                        }}
                      </div>
                      <span class="font-medium">{{
                        user.name || user.email?.split("@")[0] || "Unknown"
                      }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {{ user.email || "No email" }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-3 py-1 text-xs rounded-full font-medium"
                      :class="
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-600'
                      "
                    >
                      {{ user.role === "admin" ? "Admin" : "Customer" }}
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
                      @click="toggleRole(user)"
                      class="text-purple-600 hover:underline text-sm font-medium"
                    >
                      {{
                        user.role === "admin" ? "Make Customer" : "Make Admin"
                      }}
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

// Stats with enhanced calculations
const stats = computed(() => {
  const deliveredOrders = orderStore.orders.filter(
    (o) => o.status === "delivered"
  );
  const deliveredRevenue = deliveredOrders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );

  const pendingOrders = orderStore.orders.filter(
    (o) => o.status === "pending"
  ).length;

  // Calculate low stock products (assuming products have stock field)
  const lowStockProducts = productStore.products.filter((p) => {
    const stock = p.stock || p.totalStock || 0;
    return stock < 10 && stock > 0;
  }).length;

  // Calculate new customers this month
  const now = new Date();
  const thisMonth = now.getMonth();
  const newCustomers = userStore.users.filter((u) => {
    if (!u.createdAt) return false;
    const userDate = u.createdAt.toDate
      ? u.createdAt.toDate()
      : new Date(u.createdAt);
    return (
      userDate.getMonth() === thisMonth &&
      userDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Calculate revenue change (simplified)
  const thisMonthRevenue = deliveredOrders
    .filter((o) => {
      if (!o.createdAt) return false;
      const orderDate = o.createdAt.toDate
        ? o.createdAt.toDate()
        : new Date(o.createdAt);
      return orderDate.getMonth() === thisMonth;
    })
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const lastMonthRevenue = deliveredOrders
    .filter((o) => {
      if (!o.createdAt) return false;
      const orderDate = o.createdAt.toDate
        ? o.createdAt.toDate()
        : new Date(o.createdAt);
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const year = thisMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return (
        orderDate.getMonth() === lastMonth && orderDate.getFullYear() === year
      );
    })
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const revenueChange =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0
      ? 100
      : 0;

  return {
    totalRevenue: Math.round(deliveredRevenue),
    totalOrders: orderStore.orders.length,
    pendingOrders,
    totalProducts: productStore.products.length,
    lowStockProducts,
    activeCustomers: userStore.users.filter((u) => !u.disabled).length,
    newCustomers,
    revenueChange,
  };
});

const recentOrders = computed(() =>
  [...orderStore.orders]
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds || a.createdAt || 0;
      const dateB = b.createdAt?.seconds || b.createdAt || 0;
      return dateB - dateA;
    })
    .slice(0, 8)
);

const filteredUsers = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return userStore.users.filter(
    (u) =>
      (u.email || "").toLowerCase().includes(q) ||
      (u.name || "").toLowerCase().includes(q)
  );
});

// Helpers
const formatDate = (timestamp) => {
  if (!timestamp) return "—";

  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

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
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30",
  };
  return map[status] || "bg-gray-100 text-gray-700 dark:bg-gray-600";
};

const tabClass = (tab) =>
  activeTab.value === tab
    ? "px-8 py-4 font-semibold text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20"
    : "px-8 py-4 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700";

// User Actions
const startEdit = (user) => {
  editingId.value = user.id;
  editName.value = user.name || "";
  nextTick(() => editInput.value?.focus());
};

const saveName = async (user) => {
  const newName = editName.value.trim();
  if (newName && newName !== user.name) {
    try {
      await userStore.updateUserName(user.id, newName);
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name: " + error.message);
    }
  }
  editingId.value = null;
};

const cancelEdit = () => {
  editingId.value = null;
};

const toggleRole = async (user) => {
  const newRole = user.role === "admin" ? "customer" : "admin";
  if (confirm(`Are you sure you want to make ${user.email} ${newRole}?`)) {
    try {
      await userStore.updateUserRole(user.id, newRole);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role: " + error.message);
    }
  }
};

const toggleBlock = async (user) => {
  const action = user.disabled ? "unblock" : "block";
  if (confirm(`Are you sure you want to ${action} ${user.email}?`)) {
    try {
      await userStore.toggleUserBlock(user.id, !user.disabled);
    } catch (error) {
      console.error("Error toggling block:", error);
      alert("Failed to update user status: " + error.message);
    }
  }
};

const updateOrderStatus = async (order) => {
  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const currentIndex = statuses.indexOf(order.status || "pending");
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];

  if (confirm(`Update order #${order.id.slice(-8)} to "${nextStatus}"?`)) {
    try {
      await orderStore.updateOrderStatus(order.id, nextStatus);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order: " + error.message);
    }
  }
};

const refreshData = async () => {
  try {
    await Promise.all([
      orderStore.fetchOrders(),
      productStore.fetchProducts(),
      userStore.fetchUsers(),
    ]);
    if (chart) {
      chart.destroy();
      createChart();
    }
  } catch (error) {
    console.error("Error refreshing data:", error);
    alert("Failed to refresh data: " + error.message);
  }
};

// Chart
onMounted(async () => {
  try {
    await Promise.all([
      orderStore.fetchOrders(),
      productStore.fetchProducts(),
      userStore.fetchUsers(),
    ]);

    if (chartCanvas.value) {
      createChart();
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
});

const createChart = () => {
  const ctx = chartCanvas.value.getContext("2d");

  // Prepare monthly data
  const monthly = Array(12).fill(0);
  const orderCounts = Array(12).fill(0);

  orderStore.orders.forEach((order) => {
    if (order.status === "delivered" && order.createdAt) {
      let date;
      if (order.createdAt.toDate) {
        date = order.createdAt.toDate();
      } else if (order.createdAt.seconds) {
        date = new Date(order.createdAt.seconds * 1000);
      } else {
        date = new Date(order.createdAt);
      }

      const month = date.getMonth();
      monthly[month] += order.total || 0;
      orderCounts[month] += 1;
    }
  });

  // Destroy existing chart
  if (chart) chart.destroy();

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
          label: "Revenue ($)",
          data: monthly,
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#6366f1",
          pointRadius: 5,
          pointHoverRadius: 8,
          yAxisID: "y",
        },
        {
          label: "Orders",
          data: orderCounts,
          borderColor: "rgb(245, 158, 11)",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.4,
          borderDash: [5, 5],
          fill: false,
          pointBackgroundColor: "#f59e0b",
          pointRadius: 4,
          pointHoverRadius: 7,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.datasetIndex === 0) {
                label += "$" + context.parsed.y.toLocaleString();
              } else {
                label += context.parsed.y;
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Revenue ($)",
          },
          ticks: {
            callback: function (value) {
              return "$" + value.toLocaleString();
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Orders",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
};

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>
