<template>
  <!-- <p>{{ colors.teas.find((a) => a.name === "black").color }}</p> -->
  <p>current : {{ currColor }}</p>
  <p>next : {{ nextColor ? nextColor : "null" }}</p>
  <div
    v-show="true"
    ref="threeContainer"
    class="size-[500px] justify-self-center my-auto ml-auto hidden sm:inline-block overflow-hidden"
  ></div>
</template>

<script setup>
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Geometry, ImportGLTF, Initialize } from "./3DViz";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { computed, inject, onMounted, ref, watch } from "vue";

const threeContainer = ref();
const size = ref();
const composed = inject("composed");
const colors = inject("colors");

const nextColor = computed(
  () => colors.value?.teas.find((a) => a.name === composed.value.tea)?.color
);
const currColor = ref(
  colors.value?.teas.find((a) => a.name === composed.value.tea)?.color
);

const init = new Initialize();
// init.renderer.setAnimationLoop(animate);
const scene = init.scene;

const localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.1);
const helper = new THREE.PlaneHelper(localPlane, 3, 0xffff00);
// scene.add(helper);

//---------------- IMPORT CUP --------------------//

const importCup = new ImportGLTF();
importCup
  .loadModel(import.meta.env.VITE_OBJ_CUP, 0.1)
  .then((model) => scene.add(model));
importCup.material.transparent = true;
importCup.material.opacity = 0.05;

//---------------- IMPORT TEA --------------------//

const importTea = new ImportGLTF();
importTea.material.clippingPlanes = [localPlane];
importTea.material.clipIntersection = true;
importTea.material.transmission = 1;
importTea.material.transparent = true;
importTea.material.opacity = 0.3;

importTea
  .loadModel(import.meta.env.VITE_OBJ_TEA, 0.1)
  .then((model) => scene.add(model));

const tweenTea = new TWEEN.Tween({ x: 0 })
  .to({ x: 1 }, 1000)
  .onUpdate(({ x }) => {
    importTea.material.color.lerpColors(
      importTea.material.color,
      new THREE.Color(nextColor.value),
      x
    );
  })
  .onComplete(() => {
    pauseRender();
  });

const tweenLocalPlane = new TWEEN.Tween({ x: 0 })
  .to({ x: 2.75 }, 1000)
  .onStart(() => {
    resumeRender();
  })
  .onUpdate(({ x }) => {
    localPlane.constant = x;
  })
  .onComplete(() => {
    pauseRender();
  });

let teaVisible = false;
watch(nextColor, () => {
  resumeRender();
  if (!teaVisible) {
    tweenLocalPlane.start();
    teaVisible = true;
  }
  tweenTea.start();
});

//---------------- CREATE LIGHTS --------------------//

const ambientLight = new THREE.AmbientLight(0x555555, 10);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(0, 1, 3);
scene.add(pointLight);

//------------------------------------------------//
let isPaused = true;
let initRenderView = false;
function animate(time) {
  if (!initRenderView) {
    setTimeout(() => {
      init.renderer.render(scene, init.camera);
      initRenderView = true;
    }, 100);
  }
  if (!isPaused) {
    const requestID = window.requestAnimationFrame(animate);
    TWEEN.update(time);
    init.renderer.render(scene, init.camera);
    console.log(time);
  }
}
function pauseRender() {
  isPaused = true;
}
function resumeRender() {
  if (isPaused) {
    isPaused = false;
    animate();
  }
}

onMounted(() => {
  if (threeContainer.value) {
    size.value = {
      width: threeContainer.value.clientWidth,
      height: threeContainer.value.clientHeight,
    };
    init.renderer.setSize(size.value.width, size.value.height);
    init.camera.aspect = size.value.width / size.value.height;
    init.camera.updateProjectionMatrix();
    threeContainer.value.appendChild(init.renderer.domElement);
    animate();
  }
});
</script>

<style scoped></style>
