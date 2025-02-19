<template>
  <div class="flex flex-col items-center" :key="props.title">
    <label :for="`boba-${props.title}`" class="">{{ props.title }} </label>
    <div class="">
      <button
        class="btn text-2xl text-center size-9"
        @click.prevent="decrease"
        :disabled="model?.amount === 0 || model?.amount === undefined"
      >
        -
      </button>
      <input
        type="text"
        disabled
        :name="`boba-${props.title.toLocaleLowerCase()}`"
        :id="`${props.title}`"
        class="input input-bordered text-center size-9 disabled:cursor-default"
        v-model="computedModel"
      />
      <button
        class="btn text-2xl text-center size-9"
        @click.prevent="increase"
        :disabled="model?.amount === 4 || locked"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const model = defineModel();
const emits = defineEmits(["change", "click"]);
const props = defineProps({
  title: String,
  locked: Boolean,
});

const computedModel = computed({
  get: () => (model.value?.amount !== undefined ? model.value.amount : 0),
  set: (value) => {
    model.value = value;
  },
});
const list = ref({ name: props.title, amount: 0 });
const decrease = computed(() => {
  list.value.amount--;
  model.value = list.value;
  emits("change", model.value);
  emits("click", "sub");
  console.log(model.value.amount);
});
const increase = computed(() => {
  list.value.amount++;
  model.value = list.value;
  emits("change", model.value);
  emits("click", "add");
  console.log(model.value.amount);
});
</script>

<style scoped></style>
