<template>
  <div class="grid grid-cols-2 justify-center font-bold">
    <img
      src="https://break-in.fr/cdn/shop/files/56FFFB8A-42DC-47E4-9758-2F26B56E700E_800x.png?v=1731691170"
      alt=""
      class="h-[80%] justify-self-center"
    />
    <div class="grid justify-center bg-red-200 text-primary">
      <h1 class="text-2xl font-pacifico">Buy Bubble Tea</h1>
      <form action="" class="flex flex-col gap-4">
        <label for="name" class="label"
          >Name:
          <input
            type="text"
            id="name"
            placeholder="Type your name"
            class="input input-bordered w-full max-w-xs"
        /></label>
        <label for="sirup" class="label">
          Sirup:
          <!-- Ajouter logique for loop pour les sirops quand api est pret -->
          <select id="sirup" class="select select-bordered w-full max-w-xs">
            <option disabled selected>Choose your sirup</option>
            <option value="peach">Peach</option>
            <option value="grape">Grape</option>
            <option value="strawberry">Strawberry</option>
            <option value="lemon">Lemon</option>
            <option value="orange">Orange</option>
          </select>
        </label>
        <div class="grid grid-cols-5 gap-4">
          <CounterInput />
          <CounterInput />
          <CounterInput />
          <CounterInput />
          <CounterInput />
          <CounterInput />
          <CounterInput />
          <CounterInput />
          <CounterInput />
          <CounterInput />
        </div>
        <RangeInput
          title="Sweetness"
          min="-5"
          max="5"
          startAt="0"
          step="0.5"
          :scale="['Sour', 'Balanced', 'Sweet']"
        />
        <RangeInput
          title="Ice"
          min="-5"
          max="5"
          startAt="0"
          step="0.5"
          :scale="['No Ice', 'Regular', 'Lots of Ice']"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import CounterInput from "../CounterInput.vue";
import RangeInput from "../RangeInput.vue";
</script>

<style scoped></style>
