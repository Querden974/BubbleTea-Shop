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
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
const sphereBodies = [];
for (let x = 0; x < 40; x++) {
  const sphere = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(radius),
    friction: 1,
    linearDamping: 0.7,
    allowSleep: true,
    sleepTimeLimit: 1,
    sleepSpeedLimit: 0.4,

    position: new CANNON.Vec3(
      Math.random() * 0.25,
      x * radius * 5,
      Math.random() * 0.25
    ),
  });
  sphereBodies.push(sphere);
  physicsWorld.addBody(sphere);
  setTimeout(() => {
    sphere.sleep();
    // pauseRender();
  }, 5000);
}
const sphereMehses = [];
sphereBodies.forEach((sphere) => {
  const sphereGeo = new THREE.SphereGeometry(radius);
  const sphereMat = new THREE.MeshNormalMaterial();
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  sphereMehses.push(sphereMesh);
  scene.add(sphereMesh);
});

const localPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.1);
const helper = new THREE.PlaneHelper(localPlane, 3, 0xffff00);
// scene.add(helper);

const collider = new GLTFLoader();

collider.load("/untitled.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model); // Ajout du modèle à la scène Three.js

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.transparent = true;
      child.material.opacity = 0;

      // On crée un corps physique correspondant à la géométrie
      createPhysics(child);
    }
  });
});
function createPhysics(mesh) {
  mesh.updateMatrixWorld(true); // Appliquer l'échelle et la rotation

  // Extraire les sommets et les indices correctement
  const vertices = Array.from(mesh.geometry.attributes.position.array).reduce(
    (acc, val, i) => {
      if (i % 3 === 0) acc.push(new CANNON.Vec3());
      acc[acc.length - 1][["x", "y", "z"][i % 3]] = val;
      return acc;
    },
    []
  );

  const indices = Array.from(mesh.geometry.index.array);
  const faces = [];
  for (let i = 0; i < indices.length; i += 3) {
    faces.push([indices[i], indices[i + 1], indices[i + 2]]);
  }

  // Création du shape ConvexPolyhedron
  const shape = new CANNON.ConvexPolyhedron({ vertices, faces });

  // Création du corps physique
  const body = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: shape,
    position: new CANNON.Vec3(
      mesh.position.x,
      mesh.position.y,
      mesh.position.z
    ),
  });

  physicsWorld.addBody(body);
  mesh.userData.body = body; // Associer le corps au mesh pour la synchro
}

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
  // physicsWorld.step(1 / 128);
  physicsWorld.fixedStep();
  // cannonDebugger.update();
  orbit.update();
  if (!initRenderView) {
    setTimeout(() => {
      init.renderer.render(scene, init.camera);
      initRenderView = true;
      // physicsWorld.fixedStep();
    }, 100);
  }
  if (!isPaused) {
    const requestID = window.requestAnimationFrame(animate);
    TWEEN.update(time);
    // cannonDebugger.update();
    sphereMehses.forEach((sphere, index) => {
      sphere.position.copy(sphereBodies[index].position);
      sphere.quaternion.copy(sphereBodies[index].quaternion);
    });
    // sphereMesh.position.copy(sphere.position);
    // sphereMesh.quaternion.copy(sphere.quaternion);
    init.renderer.render(scene, init.camera);
    // console.log(time);
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
const orbit = new OrbitControls(init.camera, init.renderer.domElement);
orbit.update();
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
    // const orbit = new OrbitControls(init.camera, threeContainer.value);
    orbit.update();
    // physicsWorld.step(1 / 25);
    animate();
  }
});
</script>

<style scoped></style>
