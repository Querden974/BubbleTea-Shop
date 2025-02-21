<template>
  <div
    class="flex flex-col auto-rows-min justify-center font-delius gap-6"
    v-if="langData && langData.buy[lang]"
  >
    <h1
      class="text-2xl text-center h-min"
      v-if="langData && langData.buy[lang]"
    >
      {{ langData.buy[lang].title }}
    </h1>
    <div class="sm:grid sm:grid-cols-2 sm:gap-32">
      <!-- <img
        src="../../assets/winnies-special-tea-bubble-tea-cup-q9b8f2tsdm8omdh1.png"
        alt=""
        draggable="false"
        class="min-h-60 max-h-100 justify-self-center my-auto ml-auto hidden sm:inline-block"
      /> -->
      <div
        id="viz"
        class="justify-self-center my-auto ml-auto hidden sm:inline-block w-fit h-fit overflow-hidden"
      >
        <Viz />
      </div>
      <!-- Bubble tea Editor Form -->
      <div class="grid justify-center text-primary mr-auto gap-6">
        <form action="" class="flex flex-col gap-4 text-sm">
          <div class="flex gap-2 items-baseline">
            <label
              for="name"
              class="min-w-18 ml-auto"
              v-if="langData && langData.buy[lang]"
              >{{ langData.buy[lang].name }}</label
            >
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
            <label
              for="sirup"
              class="min-w-18"
              v-if="langData && langData.buy[lang]"
              >{{ langData.buy[lang].sirup }}</label
            >
            <select
              id="sirup"
              class="select select-bordered w-full max-w-xs"
              v-model="composed.sirup"
            >
              <option disabled selected>Choose your sirup</option>
              <option
                v-if="sirupFlavors && sirupFlavors[lang]"
                v-for="sirup in sirupFlavors[lang]"
                :value="sirup.code"
                :key="sirup.code"
              >
                {{ sirup.name }}
              </option>
            </select>
          </div>

          <!-- ------------------------------------------------------------- -->
          <!-- TEA FLAVORS -->
          <div for="tea" class="flex flex-row w-full">
            <label
              class="min-w-18"
              for=""
              v-if="langData && langData.buy[lang]"
              >{{ langData.buy[lang].tea }}</label
            >
            <div class="flex justify-evenly w-full">
              <RadioInput
                v-if="teaFlavors && teaFlavors[lang]"
                v-for="(tea, index) in teaFlavors[lang]"
                :key="tea.code"
                :code="tea.code"
                :index="index"
                :title="tea.name"
                :length="teaFlavors[lang].length"
                v-model="composed.tea"
              />
            </div>
          </div>
          <!-- ------------------------------------------------------------- -->
          <hr class="text-gray-400" />
          <!-- BOBA FLAVORS -->
          <div class="flex flex-col gap-2">
            <label
              for="boba"
              class="text-sm"
              v-if="langData && langData.buy[lang]"
              >{{ langData.buy[lang].boba }}
              <b class="underline f">{{ maxBoba - bobaCount }}</b>
              {{ langData.buy[lang].boba_count }}</label
            >
            <div class="grid grid-cols-4 gap-4">
              <CounterInput
                v-if="bobaFlavors && bobaFlavors[lang]"
                v-for="boba in bobaFlavors[lang]"
                :title="boba.name"
                :locked="bobaLock"
                :key="boba.code"
                @change="(value) => addBoba(value)"
                @click="(type) => changeAmount(type)"
              />
            </div>
          </div>

          <hr class="text-gray-400" />
          <!-- ------------------------------------------------------------- -->
          <RangeInput
            v-if="langData && langData.buy[lang]"
            :title="langData.buy[lang].sweetness"
            :min="-5"
            :max="5"
            :step="0.5"
            :startAt="0"
            :scale="langData.buy[lang].sweet_level"
            v-model="composed.sweetness"
          />
          <RangeInput
            v-if="langData && langData.buy[lang]"
            :title="langData.buy[lang].ice"
            :min="0"
            :max="5"
            :step="0.5"
            :startAt="2.5"
            :scale="langData.buy[lang].ice_level"
            v-model="composed.ice"
          />

          <input
            v-if="langData && langData.buy[lang]"
            type="submit"
            :value="langData.buy[lang].submit"
            class="btn btn-primary"
            :disabled="submitable"
          />
        </form>
      </div>
      <!-- End Bubble tea Editor Form -->
    </div>
  </div>
  <p>{{ composed }}</p>
</template>

<script setup>
import CounterInput from "../CounterInput.vue";
import RangeInput from "../RangeInput.vue";
import RadioInput from "../RadioInput.vue";
// import vizualize, { setSize } from "../functions/3DViz.vue";
import Viz from "../functions/Viz.vue";
import {
  ref,
  computed,
  onMounted,
  onBeforeMount,
  watch,
  inject,
  unref,
  provide,
} from "vue";
import { Container } from "postcss";

const ingredients = ref();
const bobaFlavors = ref();
const sirupFlavors = ref();
const teaFlavors = ref();

const lang = inject("lang");
const langData = inject("langData");

const api = ref(import.meta.env.VITE_API_INGR);
const vizContainer = ref();
const vizSize = ref();

onBeforeMount(async () => {
  // Fetch ingredients
  try {
    const response = await fetch(api.value); // ✅ Corrige le chemin
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    ingredients.value = await response.json();
    bobaFlavors.value = ingredients.value.boba;
    sirupFlavors.value = ingredients.value.sirup;
    teaFlavors.value = ingredients.value.tea;
    //console.log(ingredients.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des ingrédients :", error);
  }

  //Set Size of 3D Viz
});

const composed = ref({
  name: "",
  sirup: "",
  tea: "",
  boba: [],
  sweetness: 0,
  ice: 0,
});
provide("composed", composed);

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
