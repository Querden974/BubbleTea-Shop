<template>
  <button
    :value="code"
    @click="emits('click', code)"
    class="flex items-center gap-2 p-1 hover:bg-red-300 hover:rounded-md w-full cursor-pointer"
  >
    <div class="rounded-full size">
      <span :class="`fi fis fi-${code} rounded-full`"></span>
    </div>
    <p class="text-xs">{{ lang }}</p>
  </button>
</template>

<script setup>
const props = defineProps({
  lang: String,
  code: String,
});

const emits = defineEmits(["click"]);
</script>

<style scoped></style>
