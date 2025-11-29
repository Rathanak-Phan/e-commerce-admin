<!-- src/views/Profile.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">My Profile</h1>

      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        <!-- Cover + Avatar -->
        <div class="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
          <div class="absolute -bottom-20 left-1/2 -translate-x-1/2">
            <div class="relative">
              <!-- KEY FIX: Add key to force re-render when photo changes -->
              <img
                :key="userPhoto"
                :src="userPhoto"
                class="w-40 h-40 rounded-full ring-8 ring-white dark:ring-gray-800 object-cover shadow-2xl border-4 border-white"
                @error="handleImageError"
                @load="photoError = false"
              />
              <label class="absolute bottom-3 right-3 cursor-pointer">
                <input type="file" accept="image/*" @change="uploadPhoto" class="hidden" />
                <div class="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg transition">
                  <CameraIcon class="w-6 h-6 text-white" />
                </div>
              </label>
              <!-- Fallback Initials -->
              <div v-if="photoError" class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white text-6xl font-bold">
                {{ userInitial }}
              </div>
            </div>
          </div>
        </div>

        <div class="pt-24 px-8 pb-10">
          <form @submit.prevent="saveProfile" class="space-y-8">
            <!-- Name & Email -->
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold mb-2">Full Name</label>
                <input v-model="form.name" required
                  class="w-full px-5 py-4 rounded-xl border dark:bg-gray-700 focus:ring-4 focus:ring-indigo-300" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Email</label>
                <input :value="authStore.user?.email" disabled
                  class="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-700" />
              </div>
            </div>

            <!-- Bio -->
            <div>
              <label class="block text-sm font-semibold mb-2">Bio</label>
              <textarea v-model="form.bio" rows="5" placeholder="Tell us about yourself..."
                class="w-full px-5 py-4 rounded-xl border dark:bg-gray-700 focus:ring-4 focus:ring-indigo-300 resize-none"></textarea>
            </div>

            <!-- Paste Image URL -->
            <div>
              <label class="block text-sm font-semibold mb-2">
                Photo URL (Paste any image link)
              </label>
              <div class="flex gap-3">
                <input 
                  v-model="photoUrlInput"
                  @keyup.enter="applyUrl"
                  placeholder="https://example.com/photo.jpg"
                  class="flex-1 px-5 py-4 rounded-xl border dark:bg-gray-700 focus:ring-4 focus:ring-indigo-300"
                />
                <button type="button" @click="applyUrl"
                  class="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition">
                  Apply URL
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                Works with Unsplash, Facebook, Instagram, etc.
              </p>
            </div>

            <!-- Current Photo URL -->
            <div>
              <label class="block text-sm font-semibold mb-2">Current Photo URL</label>
              <input :value="form.photoURL || 'Using default photo'" readonly
                class="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm font-mono text-gray-600 break-all" />
            </div>

            <!-- Buttons -->
            <div class="flex justify-center gap-6">
              <button type="submit" :disabled="saving"
                class="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg">
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button type="button" @click="loadProfile"
                class="px-10 py-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancel
              </button>
            </div>

            <p v-if="success" class="text-center text-green-600 dark:text-green-400 font-semibold text-lg mt-6">
              Profile updated successfully!
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { doc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/firebase'
import { CameraIcon } from '@heroicons/vue/24/solid'

const authStore = useAuthStore()
const photoError = ref(false)
const saving = ref(false)
const success = ref(false)
const photoUrlInput = ref('')

const form = ref({
  name: '',
  bio: '',
  photoURL: ''
})

// Default beautiful photo
const defaultPhoto = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80'

const userInitial = computed(() => 
  (form.value.name || authStore.user?.email || 'A').charAt(0).toUpperCase()
)

const userPhoto = computed(() => {
  return form.value.photoURL || authStore.userProfile?.photoURL || defaultPhoto
})

// CRITICAL FIX: Handle image load/error properly
const handleImageError = () => {
  photoError.value = true
}

// When photo URL changes → reset error
watch(() => form.value.photoURL, () => {
  photoError.value = false
})

// Apply URL from input
const applyUrl = () => {
  const url = photoUrlInput.value.trim()
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    form.value.photoURL = url
    photoUrlInput.value = ''
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } else if (url) {
    alert('Please enter a valid URL starting with http:// or https://')
  }
}

const loadProfile = () => {
  form.value = {
    name: authStore.userProfile?.name || authStore.user?.displayName || 'Alex Johnson',
    bio: authStore.userProfile?.bio || '',
    photoURL: authStore.user?.photoURL || authStore.userProfile?.photoURL || ''
  }
  photoError.value = false // Reset on load
}

const uploadPhoto = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  saving.value = true
  try {
    const uid = authStore.user.uid
    const photoRef = storageRef(storage, `profiles/${uid}/avatar.jpg`)
    await uploadBytes(photoRef, file)
    const url = await getDownloadURL(photoRef)
    form.value.photoURL = url
    photoError.value = false
    success.value = true
  } catch (err) {
    alert('Upload failed: ' + err.message)
  } finally {
    saving.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  success.value = false
  try {
    const uid = authStore.user.uid
    await updateDoc(doc(db, 'users', uid), {
      name: form.value.name.trim(),
      bio: form.value.bio,
      photoURL: form.value.photoURL
    })
    authStore.userProfile = { ...authStore.userProfile, ...form.value }
    success.value = true
  } catch (err) {
    alert('Save failed: ' + err.message)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>