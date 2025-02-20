<template>
  <button
    :disabled="code === current"
    :value="code"
    @click="emits('click', code)"
    :class="`flex items-center gap-2 p-1 disable  hover:rounded-md  w-fitsm:w-full cursor-pointer hover:bg-primary/80`"
  >
    <div class="rounded-full size">
      <span :class="`fi fis fi-${code} rounded-full`"></span>
    </div>
    <p class="text-xs sm:block hidden">{{ lang }}</p>
  </button>
</template>

<script setup>
const props = defineProps({
  lang: String,
  code: String,
  current: String,
});

const emits = defineEmits(["click"]);
</script>

<style scoped></style>
