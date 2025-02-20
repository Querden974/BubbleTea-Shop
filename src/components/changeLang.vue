<template>
  <div class="relative cursor-pointer w-20">
    <div
      :class="`border rounded-md flex justify-between items-center p-1  ${
        theme
          ? 'shadow-white/25 border-white/25 bg-white/25 hover:bg-white/50'
          : 'shadow-base-300 border-base-300 bg-base-300/70 hover:bg-base-300/50'
      }`"
      @click="showLangs"
    >
      <div class="rounded-full">
        <span :class="`fi fis fi-${currentLang} rounded-full`"></span>
      </div>
      <p class="text-xs w-full text-center">
        {{ langs.find((l) => l.code === currentLang).lang }}
      </p>
    </div>
    <div
      :class="`absolute mt-1 z-10 bg-red-800 w-full p-1 border rounded-md ${
        openLangs ? '' : 'hidden'
      }`"
    >
      <LangBtn
        v-for="lang in langs"
        :key="lang.code"
        :lang="lang.lang"
        :code="lang.code"
        @click="(val) => handleLang(val)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LangBtn from "./LangBtn.vue";

const props = defineProps({
  theme: Boolean,
});

const langs = [
  { code: "gb", lang: "English" },
  { code: "fr", lang: "Français" },
  { code: "jp", lang: "日本語" },
];

const openLangs = ref(false);
const currentLang = ref("gb");
const showLangs = () => {
  openLangs.value = !openLangs.value;
  console.log(openLangs.value);
};

const handleLang = (val) => {
  currentLang.value = val;
  openLangs.value = false;
};
</script>

<style scoped></style>
