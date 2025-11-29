<template>
  <div v-if="$route.path === '/login'">
    <router-view />
  </div>
  <Layout v-else />
</template>

<script setup>
import Layout from './components/layout/Layout.vue'
</script>