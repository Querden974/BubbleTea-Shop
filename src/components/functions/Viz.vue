<template>
  <!-- <p>{{ colors.teas.find((a) => a.name === "black").color }}</p> -->
  <!-- <div class="flex flex-col h-fit">
    <p>current : {{ currColor }}</p>
    <p>next : {{ nextColor ? nextColor : "null" }}</p>
    <p>{{ boba }}</p>
    <p>{{ bobaNextAmount ? bobaNextAmount : 0 }}</p>
    <p>{{ bobaNextFlavor ? bobaNextFlavor : "null" }}</p>
    <p>{{ bobaCurrentAmount }}</p>
  </div> -->
  <div
    v-show="true"
    ref="threeContainer"
    class="size-[500px] justify-self-center my-auto ml-auto hidden sm:inline-block overflow-hidden"
  ></div>
</template>

<script setup>
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  ImportGLTF,
  Initialize,
  CreateSpherePhysics,
  RemoveSpherePhysics,
  sphereElements,
  createPhysics,
} from "./3DViz";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { computed, inject, onMounted, ref, watch } from "vue";
import { ClearPass } from "three/examples/jsm/Addons.js";

const props = defineProps({
  BobaSel: String,
});

const threeContainer = ref();
const size = ref();
const composed = inject("composed");
const colors = inject("colors");
const boba = computed(() => {
  const tastes = [];
  composed.value.boba.forEach((boba) => {
    tastes.push({ taste: boba.name, amount: boba.amount * 10 });
  });
  return tastes;
});
const bobaNextAmount = computed(() =>
  boba.value?.reduce((acc, val) => {
    acc += val?.amount;
    return acc;
  }, 0)
);
const bobaNextFlavor = computed(() =>
  boba.value?.reduce((acc, val) => {
    return val.taste;
  }, 0)
);

const bobaCurrentAmount = ref(0);

const nextColor = computed(
  () => colors.value?.teas.find((a) => a.name === composed.value.tea)?.color
);
const currColor = ref(
  colors.value?.teas.find((a) => a.name === composed.value.tea)?.color
);

const init = new Initialize();
init.camera.position.set(0, 1, 3.5);

// init.renderer.setAnimationLoop(animate);
const scene = init.scene;

const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
  allowSleep: true,
  frictionGravity: new CANNON.Vec3(0, -9.82, 0),
});

const cannonDebugger = new CannonDebugger(scene, physicsWorld);

const groundPlane = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
});
groundPlane.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

physicsWorld.addBody(groundPlane);

const radius = 0.1;
let timedOut;
let selection;
watch([bobaNextAmount, bobaNextFlavor, props], ([newVal, flavor, selected]) => {
  clearTimeout(timedOut);
  if (newVal > bobaCurrentAmount.value) {
    resumeRender();
    const color = colors?.value?.bobas?.find(
      (a) => a.name === selected.BobaSel
    ).color;
    CreateSpherePhysics(radius, 10, flavor, color, scene, physicsWorld);
    bobaCurrentAmount.value = newVal;
    timedOut = setTimeout(() => {
      sphereElements.forEach((sphere) => {
        sphere.body.sleep();
        pauseRender();
      });
    }, 5000);
  } else {
    resumeRender();
    selection = sphereElements
      .filter(
        (sphere) =>
          sphere.flavor.toLowerCase() === selected.BobaSel.toLowerCase()
      )
      .slice(0, 10);
    selection.forEach((sphere) => {
      RemoveSpherePhysics(sphere, selected.BobaSel, scene, physicsWorld);
      sphereElements.splice(sphereElements.indexOf(sphere), 1);
    });

    bobaCurrentAmount.value = newVal;

    timedOut = setTimeout(() => {
      pauseRender();
    }, 5000);
  }
});

const localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.1);
const helper = new THREE.PlaneHelper(localPlane, 3, 0xffff00);
// scene.add(helper);

// const cylinder = new CANNON.Body({
//   type: CANNON.Body.STATIC,
//   invMass: 0,
//   shape: new CANNON.Cylinder(1, 0.75, 3, 64),
//   position: new CANNON.Vec3(0, 1, 0),
// });
// physicsWorld.addBody(cylinder);

const collider = new GLTFLoader();

collider.load("/untitled.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model); // Ajout du modèle à la scène Three.js

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.transparent = true;
      child.material.opacity = 0.5;
      child.scale.set(1, 1, 1);

      // On crée un corps physique correspondant à la géométrie
      createPhysics(child, physicsWorld);
    }
  });
});

//---------------- IMPORT CUP --------------------//
// const importCup = new ImportGLTF();
// importCup
//   .loadModel(import.meta.env.VITE_OBJ_CUP, 1)
//   .then((model) => scene.add(model));
// importCup.material.transparent = true;
// importCup.material.opacity = 0.5;
//---------------- IMPORT TEA --------------------//

const importTea = new ImportGLTF();
importTea.material.clippingPlanes = [localPlane];
importTea.material.clipIntersection = true;
importTea.material.transmission = 1;
importTea.material.transparent = true;
importTea.material.opacity = 0.3;

importTea
  .loadModel(import.meta.env.VITE_OBJ_TEA, 1)
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

// RENDER CONTROLS
let isPaused = false;
let initRenderView = false;

function animate(time) {
  physicsWorld.fixedStep(1 / 24, 10);

  // cannonDebugger.update();
  // orbit.update();
  if (!initRenderView) {
    setTimeout(() => {
      init.renderer.render(scene, init.camera);
      initRenderView = true;
    }, 100);
  }
  if (!isPaused) {
    const requestID = window.requestAnimationFrame(animate);
    TWEEN.update(time);
    sphereElements.forEach((sphere, index) => {
      sphere.mesh.position.copy(sphere.body.position);
      sphere.mesh.quaternion.copy(sphere.body.quaternion);
      // sphere.radius.copy(sphereBodies[index].shapes[0].radius);
    });

    init.renderer.render(scene, init.camera);
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
//-----------------------------------------------//
// const orbit = new OrbitControls(init.camera, init.renderer.domElement);
// orbit.update();
onMounted(() => {
  if (threeContainer.value) {
    size.value = {
      width: threeContainer.value.clientWidth,
      height: threeContainer.value.clientHeight,
    };
    init.renderer.setSize(size.value.width, size.value.height);
    init.camera.aspect = size.value.width / size.value.height;
    // init.camera.rotation.x = Math.PI / 2;
    init.camera.updateProjectionMatrix();
    threeContainer.value.appendChild(init.renderer.domElement);
    // orbit.update();
    animate();
  }
});
</script>

<style scoped></style>
