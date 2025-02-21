<template>
  <div v-show="true" ref="threeContainer" class="size-[500px]"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { inject, onMounted, ref } from "vue";

const threeContainer = ref();
const size = ref();
const composed = inject("composed");
console.log(composed.value);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.localClippingEnabled = true;
renderer.setAnimationLoop(animate);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);
camera.position.set(0, 1.5, 3.5);
camera.rotation.x = (Math.PI / 2) * 0.05;

//const orbit = new OrbitControls(camera, renderer.domElement);

//---------------- IMPORT CUP --------------------//

const cupMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.05,
  wireframe: false,
  side: THREE.DoubleSide,
});
const cup = new GLTFLoader();
cup.load(
  "/cup/cup.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);

    model.position.y = 0.001;
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = cupMaterial;
      }
    });
    scene.add(model);
  },
  function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log(error);
  }
);

//------------------------------------------------//
//---------------- IMPORT LIQUID --------------------//

//Clip plane

const localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);

const globalPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 2);
const helper = new THREE.PlaneHelper(localPlane, 3, 0xffff00);
//scene.add(helper);

const liquidMaterial = new THREE.MeshPhysicalMaterial({
  transparent: true,
  roughness: 0,
  opacity: 0.4,

  transmission: 1,
  wireframe: false,
  clipIntersection: true,
  clipShadows: true,
  clippingPlanes: [localPlane],
  side: THREE.DoubleSide,
});
const liquid = new GLTFLoader();
liquid.load(
  "/tea/tea.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.position.y = 0.001;
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = liquidMaterial;
      }
    });
    scene.add(model);
  },
  function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log(error);
  }
);

//------------------------------------------------//

//---------------- CREATE GROUND --------------------//

const groundGeo = new THREE.PlaneGeometry(10, 10);
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xeeeeee,
  wireframe: false,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
//scene.add(ground);

//------------------------------------------------//

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
      liquidMaterial.specularColor = new THREE.Color("#3B2F2F");
      liquidMaterial.color = new THREE.Color("#3B2F2F");
      //liquidMaterial.emissive = new THREE.Color("#3B2F2F");
      liquidMaterial.emissiveIntensity = 100;
    } else if (composed.value.tea === "green") {
      liquidMaterial.color = new THREE.Color("#A3C47D");
    } else if (composed.value.tea === "white") {
      liquidMaterial.color = new THREE.Color("#F8F5E1");
    } else if (composed.value.tea === "blue") {
      liquidMaterial.color = new THREE.Color("#6C7A89");
    }

    if (localPlane.constant < 2.75) {
      localPlane.constant += 0.02;
    }
  }
  renderer.render(scene, camera);
}

onMounted(() => {
  if (threeContainer.value) {
    size.value = {
      width: threeContainer.value.clientWidth,
      height: threeContainer.value.clientHeight,
    };
    renderer.setSize(size.value.width, size.value.height);
    camera.aspect = size.value.width / size.value.height;
    camera.updateProjectionMatrix();
    threeContainer.value.appendChild(renderer.domElement);
    animate();
  }
});
</script>

<style scoped></style>
