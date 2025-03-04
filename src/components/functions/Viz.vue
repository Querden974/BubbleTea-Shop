<template>
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
  CreateCubePhysics,
  RemoveSpherePhysics,
  RemoveCubePhysics,
  sphereElements,
  boxElements,
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

//---------------- BOBA --------------------//
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
      RemoveSpherePhysics(sphere, scene, physicsWorld);
      sphereElements.splice(sphereElements.indexOf(sphere), 1);
    });

    bobaCurrentAmount.value = newVal;

    timedOut = setTimeout(() => {
      pauseRender();
    }, 5000);
  }
});

// ----------------- END BOBA --------------------//
//---------------- ICE --------------------//
const iceAmount = computed(() => {
  return composed.value.ice * 2;
});
const iceCurrentAmount = ref(0);
const sizeIce = 0.3;
const iceCreationAmount = 2;
watch(iceAmount, (newVal) => {
  clearTimeout(timedOut);
  resumeRender();
  if (iceCurrentAmount.value === 0) {
    CreateCubePhysics(sizeIce, newVal, scene, physicsWorld);
    iceCurrentAmount.value = newVal;
  } else if (newVal > iceCurrentAmount.value) {
    CreateCubePhysics(sizeIce, iceCreationAmount, scene, physicsWorld);
    iceCurrentAmount.value = newVal;
  } else {
    selection = boxElements.slice(0, iceCreationAmount);
    selection.forEach((item) => {
      RemoveCubePhysics(item, scene, physicsWorld);
      boxElements.splice(boxElements.indexOf(item), 1);
    });
    iceCurrentAmount.value = newVal;
  }
  timedOut = setTimeout(() => {
    boxElements.forEach((item) => {
      item.body.sleep();
      pauseRender();
    });
  }, 6000);
});

//---------------- END ICE --------------------//
const localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.1);
const helper = new THREE.PlaneHelper(localPlane, 3, 0xffff00);

// --------------- BASIC CUP BOXES ---------------//
const boxBottom = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(1, 0.1, 1)),
  position: new CANNON.Vec3(0, 0.05, 0),
});
const boxLeft = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(0.1, 1, 1)),
  position: new CANNON.Vec3(-0.9, 1.15, 0),
});
const boxRight = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(0.1, 1, 1)),
  position: new CANNON.Vec3(0.9, 1.15, 0),
});
const boxBack = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 0.1)),
  position: new CANNON.Vec3(0, 1.15, -0.9),
});
const boxFront = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 0.1)),
  position: new CANNON.Vec3(0, 1.15, 0.9),
});

physicsWorld.addBody(boxBottom);
physicsWorld.addBody(boxLeft);
physicsWorld.addBody(boxRight);
physicsWorld.addBody(boxBack);
physicsWorld.addBody(boxFront);

const boxMat = new THREE.MeshPhysicalMaterial();
boxMat.color = new THREE.Color("#aaaaaa");
boxMat.transparent = true;
boxMat.opacity = 0.5;
boxMat.transmission = 1;
const boxBottomGeo = new THREE.BoxGeometry(2, 0.2, 2);
const boxBottomMesh = new THREE.Mesh(boxBottomGeo, boxMat);
boxBottomMesh.position.set(0, 0.05, 0);

const boxLeftGeo = new THREE.BoxGeometry(0.2, 2, 1.6);
const boxLeftMesh = new THREE.Mesh(boxLeftGeo, boxMat);
boxLeftMesh.position.set(-0.9, 1.15, 0);

const boxRightGeo = new THREE.BoxGeometry(0.2, 2, 1.6);
const boxRightMesh = new THREE.Mesh(boxRightGeo, boxMat);
boxRightMesh.position.set(0.9, 1.15, 0);

const boxBackGeo = new THREE.BoxGeometry(2, 2, 0.2);
const boxBackMesh = new THREE.Mesh(boxBackGeo, boxMat);
boxBackMesh.position.set(0, 1.15, -0.9);

const boxFrontGeo = new THREE.BoxGeometry(2, 2, 0.2);
const boxFrontMesh = new THREE.Mesh(boxFrontGeo, boxMat);
boxFrontMesh.position.set(0, 1.15, 0.9);

scene.add(boxLeftMesh);
scene.add(boxRightMesh);
scene.add(boxBackMesh);
scene.add(boxFrontMesh);
scene.add(boxBottomMesh);

const boxLiquid = new THREE.BoxGeometry(1.6, 1.6, 1.6);
const boxLiquidMat = new THREE.MeshPhysicalMaterial();
// boxLiquidMat.color = new THREE.Color("#ff0000");
boxLiquidMat.transparent = true;
boxLiquidMat.opacity = 0.35;
boxLiquidMat.transmission = 1;
boxLiquidMat.clipIntersection = true;
boxLiquidMat.clippingPlanes = [localPlane];
const boxLiquidMesh = new THREE.Mesh(boxLiquid, boxLiquidMat);
boxLiquidMesh.position.set(0, 1, 0);
scene.add(boxLiquidMesh);

// --------------- END BASIC CUP BOXES ---------------//

const tweenTea = new TWEEN.Tween({ x: 0 })
  .to({ x: 1 }, 1000)
  .onUpdate(({ x }) => {
    boxLiquidMat.color.lerpColors(
      boxLiquidMat.color,
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
// const orbit = new OrbitControls(init.camera, init.renderer.domElement);
function animate(time) {
  physicsWorld.fixedStep(1 / 50);

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
    });
    boxElements.forEach((box, index) => {
      box.mesh.position.copy(box.body.position);
      box.mesh.quaternion.copy(box.body.quaternion);
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
