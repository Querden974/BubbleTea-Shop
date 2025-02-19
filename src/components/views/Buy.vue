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
        <label for="sirup" class="label">
          Sirup:
          <!-- Ajouter logique for loop pour les sirops quand api est pret -->
          <select
            id="sirup"
            class="select select-bordered w-full max-w-xs"
            v-model="composed.sirup"
          >
            <option disabled selected>Choose your sirup</option>
            <option value="peach">Peach</option>
            <option value="grape">Grape</option>
            <option value="strawberry">Strawberry</option>
            <option value="lemon">Lemon</option>
            <option value="orange">Orange</option>
          </select>
        </label>
        <div class="grid grid-cols-4 gap-4">
          <CounterInput title="Tapioca" v-model="composed.boba" />
          <CounterInput title="Strawberry" />
          <CounterInput title="Peach" />
          <CounterInput title="Litchi" />
          <CounterInput title="Grape" />
          <CounterInput title="Apple" />
          <CounterInput title="Lemon" />
          <CounterInput title="Sugar" />
        </div>
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
      </form>
    </div>
    {{ composed }}
  </div>
</template>

<script setup>
import CounterInput from "../CounterInput.vue";
import RangeInput from "../RangeInput.vue";
import { ref, computed } from "vue";

const composed = ref({
  name: "",
  sirup: "",
  boba: [],
  sweetness: 0,
  ice: 0,
});

computed(() => {
  console.log(composed.value);
});
</script>

<style scoped></style>
