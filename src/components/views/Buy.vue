<template>
  <div class="flex flex-col auto-rows-min justify-center font-delius gap-6">
    <h1 class="text-2xl text-center h-min">Bubble Tea Editor</h1>
    <div class="sm:grid sm:grid-cols-2 sm:gap-32">
      <img
        src="../../assets/winnies-special-tea-bubble-tea-cup-q9b8f2tsdm8omdh1.png"
        alt=""
        draggable="false"
        class="min-h-60 max-h-100 justify-self-center my-auto ml-auto hidden sm:inline-block"
      />

      <div class="grid justify-center text-primary mr-auto gap-6">
        <form action="" class="flex flex-col gap-4 text-sm">
          <div class="flex gap-2 items-baseline">
            <label for="name" class="min-w-12">Name:</label>
            <input
              type="text"
              id="name"
              placeholder="Type your name"
              class="input input-bordered w-full max-w-xs"
              v-model="composed.name"
            />
          </div>

          <!-- SIRUP FLAVORS -->
          <div class="flex gap-2 items-baseline">
            <label for="name" class="min-w-12">Sirup:</label>
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
          </div>

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
          <hr class="text-gray-400" />
          <!-- BOBA FLAVORS -->
          <div class="flex flex-col gap-2">
            <label for="boba" class="text-sm"
              >Boba flavors:
              <b class="underline f">{{ maxBoba - bobaCount }}</b> choices
              left</label
            >
            <div class="grid grid-cols-4 gap-4">
              <CounterInput
                v-for="boba in bobaFlavors"
                :title="boba.en"
                :locked="bobaLock"
                :key="boba"
                @change="(value) => addBoba(value)"
                @click="(type) => changeAmount(type)"
              />
            </div>
          </div>

          <hr class="text-gray-400" />
          <!-- ------------------------------------------------------------- -->
          <RangeInput
            title="Sweetness"
            :min="-5"
            :max="5"
            :step="0.5"
            :startAt="0"
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
    </div>
  </div>
  <p class="col-span-2 text-center">{{ bobaFlavors }}</p>
</template>

<script setup>
import CounterInput from "../CounterInput.vue";
import RangeInput from "../RangeInput.vue";
import RadioInput from "../RadioInput.vue";
import { ref, computed, onMounted, onBeforeMount, watch } from "vue";

const ingredients = ref();
const bobaFlavors = ref();

onBeforeMount(async () => {
  try {
    const response = await fetch("/api_ingredient.json"); // ✅ Corrige le chemin
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    ingredients.value = await response.json();
    bobaFlavors.value = ingredients.value.boba;
    console.log(ingredients.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des ingrédients :", error);
  }
});

// const bobaFlavors = [
//   "Tapioca",
//   "Sugar",
//   "Peach",
//   "Grape",
//   "Apple",
//   "Lemon",
//   "Litchi",
//   "Jelly",
// ];

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
  { name: "Black", color: "#000000" },
  { name: "White", color: "lightgrey" },
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
