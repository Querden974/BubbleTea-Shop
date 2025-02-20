<template>
  <div
    v-if="langData && langData.home[lang]"
    :class="`grid grid-rows-1 gap-4 p-4 mt-6 justify-center rounded-xl bg-neutral sm:bg-transparent shadow-md sm:shadow-none ${
      page === 'night'
        ? 'sm:shadow-white/25 sm:border-white/25 '
        : 'sm:shadow-base-300 sm:border-base-300'
    }`"
  >
    <img
      class="row-start-1 col-start-1 brightness-75 rounded-xl aspect-video min-h-100 max-h-120 hidden sm:inline-block"
      src="https://images.pexels.com/photos/1148215/pexels-photo-1148215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      alt=""
      draggable="false"
    />
    <div
      class="row-start-1 col-start-1 flex flex-col justify-start sm:justify-center mt-6 z-10 p-4 sm:w-[40%] ml-auto gap-6"
    >
      <div class="font-delius">
        <h1 class="text-xl text-primary uppercase font-bold">
          {{ langData.home[lang].title }}
        </h1>
        <p class="text-white">
          {{ langData.home[lang].subtitle }}
        </p>
      </div>
      <RouterLink
        :to="{ name: 'buy' }"
        class="btn btn-primary border-none font-delius"
        >{{ langData.home[lang].button }}!</RouterLink
      >
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";
const page = document.querySelector("html").dataset.theme;
const langData = inject("langData");
const lang = inject("lang");
</script>

<style scoped></style>
