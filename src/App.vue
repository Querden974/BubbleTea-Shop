<template>
  <div class="body min-h-screen px-4 md:px-12 py-4 flex flex-col">
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

import { computed, provide, ref, onBeforeMount } from "vue";

const lang = ref(document.querySelector("html").dataset.lang);
const langData = ref();

const api = ref(import.meta.env.VITE_API_LANG);

onBeforeMount(async () => {
  try {
    const response = await fetch(api.value);
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    langData.value = await response.json();
    console.log(langData.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des ingrédients :", error);
  }
});
provide("lang", lang);
provide("langData", langData);

const year = computed(() => new Date().getFullYear());
</script>

<style scoped></style>
