<template>
  <button
    @click.prevent="composed.tea = props.code"
    :value="props.code"
    :class="`text-xs items-baseline cursor-pointer  border-base-200  w-full h-6 
    ${index == 0 ? 'rounded-l border' : ''} 
    ${index == length - 1 ? 'rounded-r border-r border-y ' : ''}
    ${index != 0 && index != length - 1 ? 'border-r border-y' : ''}
     ${
       composed.tea === props.code
         ? 'bg-primary text-neutral hover:bg-primary/80'
         : 'bg-slate-800 hover:bg-slate-600'
     }`"
  >
    {{ props.title }}
  </button>
</template>

<script setup>
import { inject } from "vue";
const model = defineModel();
const props = defineProps({
  title: String,
  color: String,
  length: Number,
  index: Number,
  code: String,
});
const composed = inject("composed");
</script>

<style scoped></style>

<!-- :style="{ color: props.color }" -->
