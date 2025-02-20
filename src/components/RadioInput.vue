<template>
  <div class="select-none">
    <label class="cursor-pointer flex gap-2">
      <span class="">{{ props.title }}</span>
      <input
        type="radio"
        name="radio-10"
        :value="props.title.toLowerCase()"
        :class="` radio radioColor radio-primary`"
        v-model="model"
      />
    </label>
  </div>
</template>

<script setup>
const model = defineModel();
const props = defineProps({
  title: String,
  color: String,
});
</script>

<style scoped></style>

<!-- :style="{ color: props.color }" -->
