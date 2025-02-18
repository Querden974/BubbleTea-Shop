<template>
  <div class="">
    <label :for="props.title.toLowerCase()">{{ props.title }}:</label>
    <input
      type="range"
      class="w-full appearance-none h-1 bg-slate-600 border-none rounded-xl accent-primary"
      :id="props.title.toLowerCase()"
      :min="props.min"
      :max="props.max"
      :value="props.startAt"
      :step="props.step"
    />
    <div class="flex w-full justify-between px-1 text-xs">
      <span v-for="level in props.scale">{{ level }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  title: String,
  min: Number,
  max: Number,
  startAt: Number,
  step: Number,
  scale: Array,
});
</script>

<style scoped></style>
