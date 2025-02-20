<template>
  <div>
    <label :for="props.title.toLowerCase()">{{ props.title }}:</label>
    <input
      type="range"
      class="w-full appearance-none h-2 bg-slate-600 border-none rounded-xl"
      :id="props.title.toLowerCase()"
      :min="props.min"
      :max="props.max"
      v-model="computedModel"
      :step="props.step"
    />
    <div class="flex w-full justify-between px-1 text-xs">
      <span v-for="level in props.scale">{{ level }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted } from "vue";

const props = defineProps({
  title: String,
  min: Number,
  max: Number,
  startAt: Number,
  step: Number,
  scale: Array,
});

const model = defineModel();
onMounted(() => (model.value = props.startAt));

const computedModel = computed({
  get: () => (model.value === undefined ? props.startAt : model.value),
  set: (newValue) => (model.value = Number(newValue)),
});
</script>

<style scoped></style>
