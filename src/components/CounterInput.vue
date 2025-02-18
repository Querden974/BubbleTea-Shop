<template>
  <div class="flex flex-col items-center">
    <label for="boba_xxx" class="">Tapioca </label>
    <div class="">
      <button class="btn text-2xl text-center size-9">-</button>
      <input
        type="text"
        value="0"
        disabled
        name="price"
        id="price"
        class="input input-bordered text-center size-9 disabled:cursor-default"
      />
      <button class="btn text-2xl text-center size-9">+</button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
