import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/views/Home.vue";
import Buy from "./components/views/Buy.vue";
import About from "./components/views/About.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/buy",
    name: "buy",
    component: Buy,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
