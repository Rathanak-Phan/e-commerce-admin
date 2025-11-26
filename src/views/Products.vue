<template>
  <div class="space-y-6">
    <!-- Header + Add Button -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Clothing Products
      </h1>
      <button
        @click="openAddModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" /> Add Clothing
      </button>
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
                  class="text-indigo-600 hover:text-indigo-800 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(p.id, p.name)"
                  class="text-red-600 hover:text-red-800"
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
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal (Same as before – full clothing form) -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto"
      >
        <div class="p-6 border-b dark:border-gray-700">
          <h2 class="text-2xl font-bold">
            {{ editing ? "Edit" : "Add" }} Clothing Product
          </h2>
        </div>
        <form @submit.prevent="saveProduct" class="p-6 space-y-6">
          <!-- Same form as previous message – name, price, category, gender, colors, sizes, images -->
          <!-- (Copy from previous answer – too long to repeat here) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-2">Name</label
              ><input
                v-model="form.name"
                required
                class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Price</label
              ><input
                v-model.number="form.price"
                type="number"
                step="0.01"
                required
                class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Gender</label>
              <select
                v-model="form.gender"
                class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Unisex</option>
              </select>
            </div>
          </div>

          <!-- Colors Input -->
          <div>
            <label class="block text-sm font-medium mb-2"
              >Colors (press Enter)</label
            >
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(c, i) in form.colors"
                :key="i"
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center gap-2 text-sm"
              >
                <span
                  class="w-4 h-4 rounded-full"
                  :style="{ background: c }"
                ></span
                >{{ c }}
                <button
                  type="button"
                  @click="form.colors.splice(i, 1)"
                  class="text-red-500"
                >
                  ×
                </button>
              </span>
            </div>
            <input
              v-model="newColor"
              @keydown.enter.prevent="
                () => {
                  if (newColor.trim()) {
                    form.colors.push(newColor.trim());
                    newColor = '';
                  }
                }
              "
              placeholder="Black, Red, Navy..."
              class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700"
            />
          </div>

          <!-- Sizes -->
          <div>
            <label class="block text-sm font-medium mb-2">Sizes</label>
            <div class="flex flex-wrap gap-4">
              <label
                v-for="s in ['XS', 'S', 'M', 'L', 'XL', 'XXL']"
                :key="s"
                class="flex items-center gap-2"
              >
                <input type="checkbox" v-model="form.sizes" :value="s" />
                <span>{{ s }}</span>
              </label>
            </div>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-medium mb-2"
              >Image URLs (one per line)</label
            >
            <textarea
              v-model="imageInput"
              rows="4"
              class="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 font-mono text-sm"
            ></textarea>
          </div>

          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
            >
              <CheckIcon class="w-5 h-5" /> {{ editing ? "Update" : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "../stores/productStore";
import { PlusIcon, CheckIcon } from "@heroicons/vue/24/solid";

const productStore = useProductStore();
const loading = ref(false);

const search = ref("");
const categoryFilter = ref("");
const genderFilter = ref("");

const showModal = ref(false);
const editing = ref(false);
const form = ref({
  name: "",
  price: 0,
  category: "men",
  gender: "Unisex",
  colors: [],
  sizes: [],
  images: [],
});
const imageInput = ref("");
const newColor = ref("");
let currentId = null;

onMounted(async () => {
  loading.value = true;
  await productStore.fetchProducts();
  loading.value = false;
});

const filteredProducts = computed(() => {
  return productStore.products
    .filter((p) => {
      const s = search.value.toLowerCase();
      return (
        (!s || p.name.toLowerCase().includes(s)) &&
        (!categoryFilter.value || p.category === categoryFilter.value) &&
        (!genderFilter.value || p.gender === genderFilter.value)
      );
    })
    .map((p) => ({
      ...p,
      totalStock: p.variants?.reduce((a, v) => a + v.stock, 0) || p.stock || 0,
    }));
});

const openAddModal = () => {
  editing.value = false;
  form.value = {
    name: "",
    price: 0,
    category: "men",
    gender: "Unisex",
    colors: [],
    sizes: [],
    images: [],
  };
  imageInput.value = "";
  showModal.value = true;
};

const openEditModal = (p) => {
  editing.value = true;
  currentId = p.id;
  form.value = {
    ...p,
    colors: [...(p.colors || [])],
    sizes: [...(p.sizes || [])],
    images: [...(p.images || [])],
  };
  imageInput.value = p.images?.join("\n") || "";
  showModal.value = true;
};

const saveProduct = async () => {
  const data = {
    ...form.value,
    images: imageInput.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };
  if (editing.value) {
    await productStore.updateProduct(currentId, data);
  } else {
    await productStore.addProduct(data);
  }
  closeModal();
};

const closeModal = () => {
  showModal.value = false;
};

const confirmDelete = (id, name) => {
  if (confirm(`Delete "${name}" permanently?`)) {
    productStore.deleteProduct(id);
  }
};
</script>
