import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import * as TWEEN from "@tweenjs/tween.js";
class Geometry {
  constructor(type) {
    this.geo = type;
    this.material = new THREE.MeshPhysicalMaterial({
      transparent: false,
      roughness: 0,
      opacity: 1,
      transmission: 0,
      wireframe: false,
      clipShadows: true,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geo, this.material);
  }
}

class ImportGLTF {
  constructor(path, scale) {
    this.material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#aaaaaa"),
      transparent: false,
      roughness: 0,
      opacity: 1,
      transmission: 0,
      wireframe: false,
      clipShadows: true,
      side: THREE.DoubleSide,
    });

    this.mesh = null;
    this.loader = new GLTFLoader();
  }

  loadModel(path, scale) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(scale, scale, scale);

          model.traverse((child) => {
            if (child.isMesh) {
              child.material = this.material;
            }
          });

          this.mesh = model;
          resolve(model);
        },
        undefined,
        (error) => reject(error)
      );
    });
  }
}
class Initialize {
  constructor() {
    this.renderer = this.initRenderer();
    this.camera = this.initCamera();
    this.scene = this.initScene();
  }

  initRenderer() {
    const render = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    render.localClippingEnabled = true;

    return render;
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);
    camera.position.set(0, 1.5, 3.5);
    // camera.rotation.x = (Math.PI / 2) * 1.5;
    return camera;
  }

  initScene() {
    const scene = new THREE.Scene();
    return scene;
  }
}
const sphereElements = [];

function CreateSpherePhysics(
  radius,
  amount,
  flavor,
  color,
  scene,
  physicsWorld
) {
  // resumeRender();
  const elements = [];
  for (let x = 0; x < amount; x++) {
    const sphere = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(radius),
      friction: 1,
      linearDamping: 0.7,
      allowSleep: true,
      sleepTimeLimit: 1,
      sleepSpeedLimit: 0.4,

      position: new CANNON.Vec3(
        Math.random() * 1 + Math.sin(x * Math.PI * 15) - 0.3,
        x * radius * 5 + 3,
        Math.sin(x * Math.PI * 10)
      ),
    });
    // console.log(colors.value.bobas.find((a) => a.name === flavor).color);
    const sphereGeo = new THREE.SphereGeometry(radius);
    const sphereMat = new THREE.MeshBasicMaterial();
    sphereMat.color = new THREE.Color(color);
    //sphereMat.color = colors.value.bobas.find((a) => a.name === flavor).color;
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);

    sphereElements.push({ mesh: sphereMesh, body: sphere, flavor: flavor });
    scene.add(sphereMesh);
    physicsWorld.addBody(sphere);
  }
  return elements;
}

function RemoveSpherePhysics(sphere, scene, physicsWorld) {
  // resumeRender();

  const sphereTween = new TWEEN.Tween({ x: 1 })
    .to({ x: 0 }, 1000)
    .onUpdate(({ x }) => {
      sphere.body.shapes[0].radius *= x;
      sphere.mesh.scale.set(x, x, x);
    })
    .onComplete(() => {
      physicsWorld.removeBody(sphere.body);
      scene.remove(sphere.mesh);
    });
  sphereTween.start();
}
const boxElements = [];
function CreateCubePhysics(size, amount, scene, physicsWorld) {
  // resumeRender();
  const elements = [];
  for (let x = 0; x < amount; x++) {
    const box = new CANNON.Body({
      mass: 3,
      shape: new CANNON.Box(
        new CANNON.Vec3(size * 0.5, size * 0.5, size * 0.5)
      ),
      friction: 1,
      linearDamping: 0.9,
      angularDamping: 0.9,
      ccdSpeedThreshold: 0.5,
      allowSleep: true,
      sleepTimeLimit: 1,
      sleepSpeedLimit: 0.4,
      quaternion: new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(1, 1, 0),
        Math.random() * Math.PI * 2
      ),
      position: new CANNON.Vec3(
        Math.sin(x * Math.PI * 2) * 0.8,
        x * size * 5 + 5,
        Math.sin(x * Math.PI * 2) * 0.8
      ),
    });
    // console.log(colors.value.bobas.find((a) => a.name === flavor).color);
    const Geo = new THREE.BoxGeometry(size, size, size);
    const Mat = new THREE.MeshBasicMaterial();
    Mat.color = new THREE.Color("#aaaaaa");
    //sphereMat.color = colors.value.bobas.find((a) => a.name === flavor).color;
    const Mesh = new THREE.Mesh(Geo, Mat);

    boxElements.push({ mesh: Mesh, body: box });
    scene.add(Mesh);
    physicsWorld.addBody(box);
  }
  return elements;
}
function RemoveCubePhysics(item, scene, physicsWorld) {
  // resumeRender();

  const Tween = new TWEEN.Tween({ x: 1 })
    .to({ x: 0 }, 1000)
    .onUpdate(({ x }) => {
      item.body.shapes[0].radius *= x;
      item.mesh.scale.set(x, x, x);
    })
    .onComplete(() => {
      physicsWorld.removeBody(item.body);
      scene.remove(item.mesh);
    });
  Tween.start();
}

function createPhysics(mesh, physicsWorld) {
  mesh.updateMatrixWorld(true);

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

  // Vérifiez que les faces sont dans le sens CCW
  faces.forEach((face) => {
    const v0 = vertices[face[0]];
    const v1 = vertices[face[1]];
    const v2 = vertices[face[2]];

    const edge1 = new CANNON.Vec3();
    const edge2 = new CANNON.Vec3();
    v1.vsub(v0, edge1);
    v2.vsub(v0, edge2);
    const normal = edge1.cross(edge2);

    if (normal.dot(v0) < 0) {
      face.reverse();
    }
  });

  const shape = new CANNON.ConvexPolyhedron({ vertices, faces });

  const body = new CANNON.Body({
    type: CANNON.Body.STATIC, // Assurez-vous que le type est correct
    shape: shape,
    // scale: new CANNON.Vec3(0.5, 0.5, 0.5),
    position: new CANNON.Vec3(
      mesh.position.x,
      mesh.position.y,
      mesh.position.z
    ),
    // Ajoutez une masse si le corps est dynamique
  });

  physicsWorld.addBody(body);
  mesh.userData.body = body;
}

export {
  Geometry,
  ImportGLTF,
  Initialize,
  CreateSpherePhysics,
  RemoveSpherePhysics,
  CreateCubePhysics,
  RemoveCubePhysics,
  createPhysics,
  sphereElements,
  boxElements,
};
