<template>
  <div
    v-show="true"
    ref="threeContainer"
    class="size-[500px] justify-self-center my-auto ml-auto hidden sm:inline-block overflow-hidden"
  ></div>
</template>

<script setup>
import * as THREE from "three";
import { Geometry, ImportGLTF, Initialize } from "./3DViz";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { inject, onMounted, ref } from "vue";

const threeContainer = ref();
const size = ref();
const composed = inject("composed");

const init = new Initialize();
init.renderer.setAnimationLoop(animate);
const scene = init.scene;

const localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.1);
const helper = new THREE.PlaneHelper(localPlane, 3, 0xffff00);
scene.add(helper);

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
importTea
  .loadModel(import.meta.env.VITE_OBJ_TEA, 0.1)
  .then((model) => scene.add(model));

//---------------- CREATE LIGHTS --------------------//

const ambientLight = new THREE.AmbientLight(0x555555, 10);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(0, 1, 3);
scene.add(pointLight);

//------------------------------------------------//

function animate() {
  if (composed.value.tea.length !== 0) {
    if (composed.value.tea === "black") {
      importTea.material.color = new THREE.Color("#3B2F2F");
      importTea.material.emissiveIntensity = 100;
    } else if (composed.value.tea === "green") {
      importTea.material.color = new THREE.Color("#A3C47D");
    } else if (composed.value.tea === "white") {
      importTea.material.color = new THREE.Color("#F8F5E1");
    } else if (composed.value.tea === "blue") {
      importTea.material.color = new THREE.Color("#6C7A89");
    }

    if (localPlane.constant < 2.75) {
      localPlane.constant += 0.02;
    }
  }
  init.renderer.render(scene, init.camera);
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
