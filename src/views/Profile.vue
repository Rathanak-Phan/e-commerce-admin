<!-- src/views/Profile.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">My Profile</h1>

      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        <!-- Cover -->
        <div class="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
          <div class="absolute -bottom-20 left-1/2 -translate-x-1/2">
            <div class="relative">
              <img
                :src="userPhoto"
                class="w-40 h-40 rounded-full ring-8 ring-white dark:ring-gray-800 object-cover shadow-2xl"
                @error="photoError = true"
              />
              <label class="absolute bottom-3 right-3 cursor-pointer">
                <input type="file" accept="image/*" @change="uploadPhoto" class="hidden" />
                <div class="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg transition">
                  <CameraIcon class="w-6 h-6 text-white" />
                </div>
              </label>
              <!-- Fallback -->
              <div v-if="photoError" class="absolute inset-0 flex items-center justify-center bg-indigo-600 rounded-full text-white text-6xl font-bold">
                {{ userInitial }}
              </div>
            </div>
          </div>
        </div>

        <div class="pt-24 px-8 pb-10">
          <form @submit.prevent="saveProfile" class="space-y-8">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold mb-2">Full Name</label>
                <input v-model="form.name" required
                  class="w-full px-5 py-4 rounded-xl border dark:bg-gray-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-700" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Email (cannot change)</label>
                <input :value="authStore.user?.email" disabled
                  class="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-700" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Bio</label>
              <textarea v-model="form.bio" rows="5" placeholder="Tell us about yourself..."
                class="w-full px-5 py-4 rounded-xl border dark:bg-gray-700 focus:ring-4 focus:ring-indigo-300"></textarea>
            </div>

            <div class="flex justify-center gap-6">
              <button type="submit" :disabled="saving"
                class="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg disabled:opacity-70">
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button type="button" @click="loadProfile"
                class="px-10 py-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancel
              </button>
            </div>

            <p v-if="success" class="text-center text-green-600 dark:text-green-400 font-semibold text-lg">
              Profile updated successfully!
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { doc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/firebase'
import { CameraIcon } from '@heroicons/vue/24/solid'

const authStore = useAuthStore()
const photoError = ref(false)
const saving = ref(false)
const success = ref(false)

const form = ref({
  name: '',
  bio: '',
  photoURL: ''
})

const userInitial = computed(() => {
  return (form.value.name || authStore.user?.email || 'A').charAt(0).toUpperCase()
})

const userPhoto = computed(() => {
  if (photoError.value) return dicebearAvatar.value
  return form.value.photoURL || authStore.userProfile?.photoURL || dicebearAvatar.value
})

const dicebearAvatar = computed(() => {
  const seed = (authStore.user?.email || 'admin').toLowerCase()
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
})

const loadProfile = () => {
  form.value = {
    name: authStore.userProfile?.name || authStore.user?.displayName || '',
    bio: authStore.userProfile?.bio || '',
    photoURL: authStore.user?.photoURL || authStore.userProfile?.photoURL || ''
  }
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
    success.value = true
    setTimeout(() => success.value = false, 3000)
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
    
    // Update local store instantly
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