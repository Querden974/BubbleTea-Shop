<template>
  <div class="grid grid-rows-1 gap-4 p-4 mt-6 justify-center">
    <img
      class="row-start-1 col-start-1 brightness-75 rounded-xl aspect-video min-h-100 max-h-120"
      src="https://images.pexels.com/photos/1148215/pexels-photo-1148215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      alt=""
      draggable="false"
    />
    <div
      class="row-start-1 col-start-1 flex flex-col justify-center mt-6 z-10 p-4 w-[40%] ml-auto gap-6"
    >
      <div class="">
        <h1 class="text-xl text-primary uppercase font-bold">
          Bubble tea lovers come to the rescue!
        </h1>
        <p>Create your onw bubble tea and enjoy it according to your taste.</p>
      </div>
      <RouterLink :to="{ name: 'buy' }" class="btn btn-primary border-none"
        >Buy Now!</RouterLink
      >
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
