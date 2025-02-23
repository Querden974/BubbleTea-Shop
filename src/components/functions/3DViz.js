import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
    camera.rotation.x = (Math.PI / 2) * 0.05;
    return camera;
  }

  initScene() {
    const scene = new THREE.Scene();
    return scene;
  }
}

export { Geometry, ImportGLTF, Initialize };
