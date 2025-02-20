import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/views/Home.vue";
import Buy from "./components/views/Buy.vue";
import About from "./components/views/About.vue";

const base = import.meta.env.VITE_ROUTE_BASE;

const routes = [
  {
    path: base + "/",
    name: "home",
    component: Home,
  },
  {
    path: base + "/buy",
    name: "buy",
    component: Buy,
  },
  {
    path: base + "/about",
    name: "about",
    component: About,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass:
    "router-link-active text-primary transition-colors transition-all duration-200 ease-in-out underline underline-offset-4",
});
