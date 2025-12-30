<template>
  <div class="space-y-6">
    <!-- Header + Add Button -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Clothing Products
      </h1>
      <div class="flex gap-2">
        <!-- Debug Button -->
        <button
          @click="debugAuth"
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg"
        >
          Debug Auth
        </button>
        <!-- Make Admin Button -->
        <button
          @click="makeAdmin"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg"
        >
          Make Me Admin
        </button>
        <!-- Add Product Button -->
        <button
          @click="openAddModal"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" /> Add Clothing
        </button>
      </div>
    </div>

    <!-- Current User Info -->
    <div v-if="currentUser" class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
      <p class="text-sm">
        Logged in as: <span class="font-semibold">{{ currentUser.email }}</span>
        <span v-if="userRole" class="ml-4">
          Role: <span class="font-semibold">{{ userRole }}</span>
        </span>
      </p>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-wrap gap-4">
      <input
        v-model="search"
        placeholder="Search name, SKU..."
        class="flex-1 min-w-64 px-4 py-2 border rounded-lg dark:bg-gray-700"
      />
      <select
        v-model="categoryFilter"
        class="px-4 py-2 border rounded-lg dark:bg-gray-700"
      >
        <option value="">All Categories</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="kids">Kids</option>
        <option value="accessories">Accessories</option>
      </select>
      <select
        v-model="genderFilter"
        class="px-4 py-2 border rounded-lg dark:bg-gray-700"
      >
        <option value="">All Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Unisex</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"
      ></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
    </div>

    <!-- Products Table -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border dark:border-gray-700"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Image
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Product
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Category
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Price
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Colors
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Sizes
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Stock
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="p in filteredProducts"
              :key="p.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <!-- Image -->
              <td class="px-6 py-4">
                <img
                  :src="p.images?.[0] || 'https://via.placeholder.com/80'"
                  class="w-16 h-16 object-cover rounded-lg"
                />
              </td>

              <!-- Name + Gender -->
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ p.name }}
                  </p>
                  <p class="text-sm text-gray-500">{{ p.gender }}</p>
                </div>
              </td>

              <!-- Category -->
              <td class="px-6 py-4 text-sm capitalize">{{ p.category }}</td>

              <!-- Price -->
              <td class="px-6 py-4 text-sm font-semibold">
                ${{ p.price.toFixed(2) }}
              </td>

              <!-- Colors -->
              <td class="px-6 py-4">
                <div class="flex gap-1">
                  <div
                    v-for="color in p.colors"
                    :key="color"
                    class="w-7 h-7 rounded-full border-2 border-white shadow"
                    :style="{ backgroundColor: color.toLowerCase() }"
                    :title="color"
                  ></div>
                </div>
              </td>

              <!-- Sizes -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="size in p.sizes"
                    :key="size"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    {{ size }}
                  </span>
                </div>
              </td>

              <!-- Stock -->
              <td class="px-6 py-4">
                <span
                  :class="
                    p.totalStock > 10
                      ? 'text-green-600'
                      : 'text-red-600 font-medium'
                  "
                >
                  {{ p.totalStock }} pcs
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-sm">
                <button
                  @click="openEditModal(p)"
                  class="text-indigo-600 hover:text-indigo-800 mr-4 px-3 py-1 hover:bg-indigo-50 rounded"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(p.id, p.name)"
                  class="text-red-600 hover:text-red-800 px-3 py-1 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <p class="text-gray-500 dark:text-gray-400">No products found.</p>
          <button
            @click="openAddModal"
            class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" /> Add Your First Product
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-6 border-b dark:border-gray-700 flex justify-between items-center"
        >
          <h2 class="text-2xl font-bold">
            {{ editing ? "Edit" : "Add" }} Clothing Product
          </h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <form @submit.prevent="saveProduct" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-2"
                >Product Name *</label
              >
              <input
                v-model="form.name"
                required
                placeholder="e.g., Classic T-Shirt"
                class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Price ($) *</label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Category *</label>
              <select
                v-model="form.category"
                required
                class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>

                <option value="tshirts">T-Shirts</option>
                <option value="shirts">Shirts</option>
                <option value="jeans">Jeans</option>
                <option value="jackets">Jackets</option>
                <option value="hoodies">Hoodies</option>

                <option value="formal-shoes">Formal Shoes</option>
                <option value="sandals">Sandals</option>
                <option value="boots">Boots</option>

                <option value="bags">Bags</option>
                <option value="watches">Watches</option>
                <option value="belts">Belts</option>
                <option value="hats">Hats</option>
                <option value="jewelry">Jewelry</option>

                <option value="sportswear">Sportswear</option>
                <option value="gym">Gym Wear</option>
                <option value="outdoor">Outdoor Wear</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Gender *</label>
              <select
                v-model="form.gender"
                required
                class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Unisex</option>
              </select>
            </div>
          </div>

          <!-- Colors Input -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Colors * (Type color and press Enter)
            </label>
            <div class="flex flex-wrap gap-2 mb-2 min-h-10">
              <span
                v-for="(c, i) in form.colors"
                :key="i"
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center gap-2 text-sm"
              >
                <span
                  class="w-4 h-4 rounded-full border border-gray-300"
                  :style="{ backgroundColor: c.toLowerCase() }"
                ></span>
                {{ c }}
                <button
                  type="button"
                  @click="removeColor(i)"
                  class="text-red-500 hover:text-red-700 text-lg leading-none"
                >
                  ×
                </button>
              </span>
              <span
                v-if="form.colors.length === 0"
                class="text-gray-400 text-sm"
              >
                No colors added yet
              </span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newColor"
                @keydown.enter.prevent="addColor"
                placeholder="Type color name and press Enter"
                class="flex-1 px-4 py-3 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                @click="addColor"
                class="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
              >
                Add
              </button>
            </div>

            <!-- Quick color buttons -->
            <div class="mt-3">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Quick add:
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  v-for="quickColor in [
                    'Black',
                    'White',
                    'Red',
                    'Blue',
                    'Green',
                    'Gray',
                    'Navy',
                    'Brown',
                  ]"
                  :key="quickColor"
                  @click="addQuickColor(quickColor)"
                  class="px-3 py-1 text-xs border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
                >
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: quickColor.toLowerCase() }"
                  ></span>
                  {{ quickColor }}
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              At least one color is required
            </p>
          </div>

          <!-- Sizes -->
          <div>
            <label class="block text-sm font-medium mb-2">Sizes *</label>
            <div class="flex flex-wrap gap-4">
              <label
                v-for="s in ['XS', 'S', 'M', 'L', 'XL', 'XXL']"
                :key="s"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="form.sizes"
                  :value="s"
                  class="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span class="select-none">{{ s }}</span>
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">Select at least one size</p>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Image URLs (One per line)
            </label>
            <textarea
              v-model="imageInput"
              rows="4"
              placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg"
              class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Enter one image URL per line. Leave empty for placeholder image.
            </p>
          </div>

          <!-- Test Data Button -->
          <div v-if="!editing">
            <button
              type="button"
              @click="fillSampleData"
              class="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Fill with sample data for testing
            </button>
          </div>

          <!-- Form Validation Errors -->
          <div
            v-if="formErrors.length > 0"
            class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <p class="font-medium text-red-800 dark:text-red-300 mb-2">
              Please fix the following errors:
            </p>
            <ul
              class="list-disc list-inside text-red-700 dark:text-red-400 text-sm"
            >
              <li v-for="error in formErrors" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div
            class="flex justify-end gap-4 pt-4 border-t dark:border-gray-700"
          >
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="
                saving || form.colors.length === 0 || form.sizes.length === 0
              "
              class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <CheckIcon class="w-5 h-5" />
              <span v-if="saving">Saving...</span>
              <span v-else>{{ editing ? "Update" : "Create" }} Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProductStore } from "../stores/productStore";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { PlusIcon, CheckIcon } from "@heroicons/vue/24/solid";

const productStore = useProductStore();
const loading = ref(false);
const saving = ref(false);

// User state
const currentUser = ref(null);
const userRole = ref("");

// Search & Filters
const search = ref("");
const categoryFilter = ref("");
const genderFilter = ref("");

// Modal state
const showModal = ref(false);
const editing = ref(false);
const form = ref({
  name: "",
  price: 0,
  category: "men",
  gender: "Unisex",
  colors: [],
  sizes: [],
});
const imageInput = ref("");
const newColor = ref("");
const formErrors = ref([]);
let currentId = null;

// Initialize
onMounted(async () => {
  console.log("Product component mounted");

  // Set up auth listener
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    currentUser.value = user;
    if (user) {
      console.log("User logged in:", user.email);
      await fetchUserRole(user.uid);
    } else {
      console.log("No user logged in");
      userRole.value = "";
    }
  });

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribe();
  });

  // Load products
  loading.value = true;
  try {
    await productStore.fetchProducts();
    console.log("Products loaded:", productStore.products.length);
  } catch (error) {
    console.error("Failed to load products:", error);
    alert("Failed to load products: " + error.message);
  } finally {
    loading.value = false;
  }
});

// Fetch user role from Firestore
const fetchUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      userRole.value = userDoc.data().role || "user";
      console.log("User role:", userRole.value);
    } else {
      console.log("No user document found");
      userRole.value = "user";
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    userRole.value = "user";
  }
};

// Filtered products
const filteredProducts = computed(() => {
  return productStore.products
    .filter((p) => {
      const s = search.value.toLowerCase();
      return (
        (!s ||
          p.name?.toLowerCase().includes(s) ||
          p.sku?.toLowerCase().includes(s)) &&
        (!categoryFilter.value || p.category === categoryFilter.value) &&
        (!genderFilter.value || p.gender === genderFilter.value)
      );
    })
    .map((p) => ({
      ...p,
      totalStock: p.variants?.reduce((a, v) => a + v.stock, 0) || p.stock || 0,
    }));
});

// Color management
const addColor = () => {
  if (newColor.value.trim()) {
    const color = newColor.value.trim();
    if (!form.value.colors.includes(color)) {
      form.value.colors.push(color);
    }
    newColor.value = "";
    formErrors.value = formErrors.value.filter((e) => !e.includes("color"));
  }
};

const addQuickColor = (color) => {
  if (!form.value.colors.includes(color)) {
    form.value.colors.push(color);
  }
  formErrors.value = formErrors.value.filter((e) => !e.includes("color"));
};

const removeColor = (index) => {
  form.value.colors.splice(index, 1);
};

// Fill sample data
const fillSampleData = () => {
  form.value.name = "Premium Cotton T-Shirt";
  form.value.price = 29.99;
  form.value.category = "men";
  form.value.gender = "Male";
  form.value.colors = ["Black", "White", "Navy"];
  form.value.sizes = ["S", "M", "L", "XL"];
  imageInput.value =
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab\nhttps://images.unsplash.com/photo-1523381210434-271e8be1f52b";
  newColor.value = "";
  formErrors.value = [];
};

// Validate form
const validateForm = () => {
  formErrors.value = [];

  if (!form.value.name || form.value.name.trim() === "") {
    formErrors.value.push("Product name is required");
  }

  if (!form.value.price || form.value.price <= 0) {
    formErrors.value.push("Valid price is required (greater than 0)");
  }

  if (form.value.colors.length === 0) {
    formErrors.value.push("At least one color is required");
  }

  if (form.value.sizes.length === 0) {
    formErrors.value.push("At least one size is required");
  }

  return formErrors.value.length === 0;
};

// Open Add Modal
const openAddModal = () => {
  if (!currentUser.value) {
    alert("Please login first!");
    return;
  }

  editing.value = false;
  form.value = {
    name: "",
    price: 0,
    category: "men",
    gender: "Unisex",
    colors: [], // Start with empty, user must add at least one
    sizes: [],
  };
  imageInput.value = "";
  newColor.value = "";
  formErrors.value = [];
  showModal.value = true;
};

// Open Edit Modal
const openEditModal = (p) => {
  if (!currentUser.value) {
    alert("Please login first!");
    return;
  }

  editing.value = true;
  currentId = p.id;
  form.value = {
    name: p.name || "",
    price: p.price || 0,
    category: p.category || "men",
    gender: p.gender || "Unisex",
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? [...p.colors] : [],
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? [...p.sizes] : [],
  };
  imageInput.value = p.images?.join("\n") || "";
  newColor.value = "";
  formErrors.value = [];
  showModal.value = true;
};

// Save Product
const saveProduct = async () => {
  console.log("=== SAVE PRODUCT START ===");

  // Check authentication
  if (!currentUser.value) {
    alert("❌ You must be logged in to save products!");
    return;
  }

  console.log("User:", currentUser.value.email);
  console.log("User UID:", currentUser.value.uid);

  // Validate form
  if (!validateForm()) {
    // Scroll to top to show errors
    const modalContent = document.querySelector(".max-h-\\[90vh\\]");
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
    return;
  }

  saving.value = true;

  try {
    // Prepare data
    const data = {
      name: form.value.name.trim(),
      price: Number(form.value.price),
      category: form.value.category,
      gender: form.value.gender,
      colors: form.value.colors,
      sizes: form.value.sizes,
      images: imageInput.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      createdBy: currentUser.value.uid,
      createdByEmail: currentUser.value.email,
      createdAt: editing.value ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Data to save:", data);

    if (editing.value) {
      console.log("Updating product:", currentId);
      await productStore.updateProduct(currentId, data);
      alert("✅ Product updated successfully!");
    } else {
      console.log("Adding new product");
      const productId = await productStore.addProduct(data);
      console.log("Product added with ID:", productId);
      alert("✅ Product added successfully!");
    }

    // Refresh products
    await productStore.fetchProducts();
    closeModal();
  } catch (error) {
    console.error("❌ Error saving product:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    if (error.code === "permission-denied") {
      alert(
        "❌ Permission denied! Please check:\n1. Firestore rules allow writes\n2. You have admin role if required"
      );
    } else if (error.code === "unauthenticated") {
      alert("❌ You need to login first!");
    } else if (error.code === "failed-precondition") {
      alert("❌ Database error. Please try again.");
    } else {
      alert("❌ Error: " + error.message);
    }
  } finally {
    saving.value = false;
    console.log("=== SAVE PRODUCT END ===");
  }
};

// Close Modal
const closeModal = () => {
  showModal.value = false;
  formErrors.value = [];
};

// Delete Product
const confirmDelete = async (id, name) => {
  if (!currentUser.value) {
    alert("Please login first!");
    return;
  }

  if (
    confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    )
  ) {
    try {
      await productStore.deleteProduct(id);
      alert("✅ Product deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Error deleting product: " + error.message);
    }
  }
};

// Debug Auth
const debugAuth = () => {
  console.log("=== DEBUG AUTH ===");
  console.log("Current user:", currentUser.value);
  console.log("User role:", userRole.value);
  console.log("Auth state:", auth.currentUser);
  console.log("Firestore connected:", !!db);
  console.log("Products count:", productStore.products.length);
  console.log("=================");

  alert(
    currentUser.value
      ? `Logged in as: ${currentUser.value.email}\nRole: ${userRole.value}\nUID: ${currentUser.value.uid}`
      : "Not logged in!"
  );
};

// Make Admin Function
const makeAdmin = async () => {
  if (!currentUser.value) {
    alert("Please login first!");
    return;
  }

  try {
    await setDoc(
      doc(db, "users", currentUser.value.uid),
      {
        email: currentUser.value.email,
        role: "admin",
        name: "Admin User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    await fetchUserRole(currentUser.value.uid);
    alert(`✅ You are now an admin!\nUID: ${currentUser.value.uid}`);
    console.log("Admin user created/updated");
  } catch (error) {
    console.error("Error making admin:", error);
    alert("❌ Error: " + error.message);
  }
};
</script>

<style scoped>
/* Add any custom styles here */
table {
  min-width: 1000px;
}

@media (max-width: 768px) {
  table {
    min-width: unset;
  }
}
</style>
