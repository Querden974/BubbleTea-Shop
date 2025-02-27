<template>
  <div
    class="flex flex-col items-center disabled:select-none"
    :key="props.title"
  >
    <label :for="`boba-${props.title}`" class="text-[0.75rem]"
      >{{ props.title }}
    </label>
    <div class="flex border border-base-200 rounded">
      <button
        class="bg-slate-800 rounded-l border-r border-base-200 text-center size-6 cursor-pointer disabled:cursor-default disabled:bg-slate-700"
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
        class="text-center border-none text-auto size-6 disabled:cursor-default bg-slate-700"
        v-model="computedModel"
      />
      <button
        class="bg-slate-800 rounded-r border-l border-base-200 text-center size-6 cursor-pointer disabled:cursor-default disabled:bg-slate-700"
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
  code: String,
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
  emits("click", { type: "sub", flavor: props.code });
});
const increase = computed(() => {
  list.value.amount++;
  model.value = list.value;
  emits("change", model.value);
  emits("click", { type: "add", flavor: props.code });
});
</script>

<style scoped></style>
