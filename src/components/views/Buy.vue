<template>
  <div class="grid grid-cols-2 justify-center font-bold">
    <img
      src="https://break-in.fr/cdn/shop/files/56FFFB8A-42DC-47E4-9758-2F26B56E700E_800x.png?v=1731691170"
      alt=""
      class="h-[80%] justify-self-center"
    />
    <div class="grid justify-center text-primary">
      <h1 class="text-2xl font-pacifico text-center">Buy Bubble Tea</h1>
      <form action="" class="flex flex-col gap-4">
        <label for="name" class="label"
          >Name:
          <input
            type="text"
            id="name"
            placeholder="Type your name"
            class="input input-bordered w-full max-w-xs"
            v-model="composed.name"
        /></label>

        <!-- SIRUP FLAVORS -->
        <label for="sirup" class="label">
          Sirup:

          <select
            id="sirup"
            class="select select-bordered w-full max-w-xs"
            v-model="composed.sirup"
          >
            <option disabled selected>Choose your sirup</option>
            <option v-for="sirup in sirupFlavors" :value="sirup">
              {{ sirup }}
            </option>
          </select>
        </label>
        <!-- ------------------------------------------------------------- -->
        <!-- TEA FLAVORS -->
        <div for="tea" class="flex flex-row w-full">
          <label class="w-fit" for="">Tea:</label>
          <div class="flex justify-evenly w-full">
            <RadioInput
              v-for="tea in teaFlavors"
              :key="tea.name"
              :title="tea.name"
              :color="tea.color"
              v-model="composed.tea"
            />
          </div>
        </div>
        <!-- ------------------------------------------------------------- -->
        <!-- BOBA FLAVORS -->
        <div class="grid grid-cols-4 gap-4">
          <CounterInput
            v-for="boba in bobaFlavors"
            :title="boba"
            :locked="bobaLock"
            :key="boba"
            @change="(value) => addBoba(value)"
            @click="(type) => changeAmount(type)"
          />
        </div>
        <!-- ------------------------------------------------------------- -->
        <RangeInput
          title="Sweetness"
          :min="-5"
          :max="5"
          :step="0.5"
          :scale="['Sour', 'Balanced', 'Sweet']"
          v-model="composed.sweetness"
        />
        <RangeInput
          title="Ice"
          :min="0"
          :max="5"
          :step="0.5"
          :startAt="2.5"
          :scale="['No Ice', 'Regular', 'Lots of Ice']"
          v-model="composed.ice"
        />

        <input
          type="submit"
          value="Submit your order"
          class="btn btn-primary"
          :disabled="submitable"
        />
      </form>
    </div>
    {{ composed }}
  </div>
</template>

<script setup>
import CounterInput from "../CounterInput.vue";
import RangeInput from "../RangeInput.vue";
import RadioInput from "../RadioInput.vue";
import { ref, computed } from "vue";

const bobaFlavors = [
  "Tapioca",
  "Sugar",
  "Peach",
  "Grape",
  "Apple",
  "Lemon",
  "Litchi",
];

const sirupFlavors = [
  "Peach",
  "Grape",
  "Strawberry",
  "Lemon",
  "Orange",
  "Pear",
  "Melon",
  "Cherry",
  "Watermelon",
];

const teaFlavors = [
  { name: "Green", color: "#00e000" },
  { name: "Black", color: "#000" },
  { name: "White", color: "#fff" },
  { name: "Blue", color: "#0000e0" },
];

const composed = ref({
  name: "",
  sirup: "",
  tea: "",
  boba: [],
  sweetness: 0,
  ice: 0,
});

const maxBoba = 4;
const bobaCount = ref(0);
const bobaLock = ref(false);

const addBoba = (value) => {
  if (
    composed.value.boba.length < maxBoba &&
    !composed.value.boba.some((boba) => boba.name === value.name)
  ) {
    composed.value.boba.push(value);
  }
  composed.value.boba.forEach((boba, index) => {
    if (boba.amount === 0) {
      composed.value.boba.splice(index, 1);
    }
  });
};

const changeAmount = (type) => {
  if (type === "sub") {
    bobaCount.value--;
  } else {
    bobaCount.value++;
  }
  if (bobaCount.value === maxBoba) {
    bobaLock.value = true;
  } else {
    bobaLock.value = false;
  }
};

const submitable = computed(() => {
  if (
    composed.value.name.length < 3 ||
    composed.value.sirup.length === 0 ||
    composed.value.tea.length === 0
  ) {
    return true;
  }
  return false;
});
</script>

<style scoped></style>
