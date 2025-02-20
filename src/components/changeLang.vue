<template>
  <div class="relative cursor-pointer w-24">
    <div
      :class="`border w-fit sm:w-full rounded-md flex gap-1 justify-between items-center p-1 m-auto ${
        theme
          ? 'shadow-white/25 border-white/25 bg-white/25 hover:bg-white/50'
          : 'shadow-base-300 border-base-300 bg-base-300/70 hover:bg-base-300/50'
      }`"
      @click="showLangs"
    >
      <div class="rounded-full">
        <span :class="`fi fis fi-${currentLang} rounded-full`"></span>
      </div>
      <p class="text-xs w-full text-center hidden sm:block">
        {{ langs.find((l) => l.code === currentLang).lang }}
      </p>
    </div>
    <div
      :class="`absolute mt-1 ml-2 sm:ml-0 z-10 w-fit sm:w-full p-1 border rounded-md  ${
        openLangs ? '' : 'hidden'
      } ${
        theme
          ? 'shadow-white/25 border-white/25 bg-white/25 '
          : 'shadow-base-300 border-base-300 bg-base-300/70 '
      }`"
    >
      <LangBtn
        v-for="lang in langs"
        :current="currentLang"
        :key="lang.code"
        :lang="lang.lang"
        :code="lang.code"
        @click="(val) => handleLang(val)"
      />
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import LangBtn from "./LangBtn.vue";

const props = defineProps({
  theme: Boolean,
});

const webLang = inject("lang");

const langs = [
  { code: "gb", lang: "English" },
  { code: "fr", lang: "Français" },
  { code: "jp", lang: "日本語" },
];

const openLangs = ref(false);
const currentLang = ref("gb");
const showLangs = () => {
  openLangs.value = !openLangs.value;
  //console.log(openLangs.value);
};

const page = document.querySelector("html");

const handleLang = (val) => {
  currentLang.value = val;
  webLang.value = val;
  page.dataset.lang = val;
  openLangs.value = false;
};
</script>

<style scoped></style>
