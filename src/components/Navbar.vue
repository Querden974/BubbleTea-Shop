<template>
  <header class="navbar grid grid-cols-3 auto-cols-fr shadow-lg font-pacifico">
    <h2
      class="font-bold text-2xl text-primary inline-flex items-center gap-2 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m17.95 9l-1.478 8.69c-.25 1.463-.374 2.195-.936 2.631c-1.2.931-6.039.88-7.172 0c-.562-.436-.687-1.168-.936-2.632L5.95 9M6 9l.514-1.286a5.908 5.908 0 0 1 10.972 0L18 9M5 9h14m-7 0l4-7m-5.99 12h.01m1 4h.01m1.99-2h.01"
        />
      </svg>
      Bubble Pop
    </h2>
    <nav class="flex gap-4 font-semibold justify-center">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'buy' }">Buy</RouterLink>
      <RouterLink :to="{ name: 'about' }">About</RouterLink>
    </nav>
  </header>
</template>

<script setup></script>

<style scoped>
.router-link-active {
  color: oklch(0.58 0.23 277);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
  transition: all 0.3s ease;
}
</style>
