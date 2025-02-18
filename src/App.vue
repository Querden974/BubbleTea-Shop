<template>
  <div class="body min-h-screen px-12 py-4 flex flex-col">
    <Navbar />
    <main class="mt-4 flex-grow">
      <RouterView />
    </main>
    <footer class="text-center text-sm text-gray-500 mb-auto">
      <p>© {{ year }} Bubble Pop</p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import { computed } from "vue";

const year = computed(() => new Date().getFullYear());
</script>

<style scoped></style>
