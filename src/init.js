import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const init = () => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

  scene.add(camera);
  const canvas = document.querySelector("canvas");

  const renderer = new THREE.WebGLRenderer({ canvas });

  renderer.setSize(sizes.width, sizes.height);

  const control = new OrbitControls(camera, canvas);
  control.enableDamping = true;

  renderer.render(scene, camera);

  return {
    sizes,
    scene,
    canvas,
    camera,
    renderer,
    control,
  };
};
