import "./styles/style.css";
import * as THREE from "three";
import TWEEN from "three/examples/jsm/libs/tween.module";
import { init } from "./init";
import renderText from "./renderText";
import clearIntersections from "./clearInterSections";
import { floors } from "./data";
import { config } from "./config";
import { setDefaultState } from "./utils";

const { baseColor, cameraScaleY, cameraScaleZ, sucsessColor, failColor } =
  config;

const dialogButton = document.querySelector(".dialogButton");
const dialog = document.querySelector("dialog");
const closeButton = document.querySelector(".closeButton");
const form = document.querySelector("form");

const { sizes, scene, canvas, camera, renderer, control } = init();

control.enableZoom = false;
control.enabled = false;

const group = new THREE.Group();

camera.position.y = cameraScaleY * floors.length;
camera.position.z = cameraScaleZ * floors.length;

floors.forEach((floor, index) => {
  const material = new THREE.MeshStandardMaterial({
    color: baseColor,
  });
  const geometry = new THREE.BoxGeometry(10, 8, 1.8);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.basePosition = new THREE.Vector3(0, index * 2, 10);

  mesh.position.set(0, index * 2, 10);
  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  mesh.index = index;
  mesh.text = floor.name;

  const htmlLight = new THREE.HemisphereLight("#e3e3e3", "#000000", 1);
  htmlLight.position.set(0, 50, 0);
  scene.add(htmlLight);
  group.add(mesh);
});

scene.add(group);

let activeIndex = -1;

const raycaster = new THREE.Raycaster();

const handleClick = (e) => {
  const pointer = new THREE.Vector2();
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(group.children);
  clearIntersections(group, activeIndex);
  if (intersections.length == 0) {
    activeIndex = -1;
  }
  const intersection = intersections.reduce((prev, next) => {
    if (prev.distance < next.distance) {
      return prev;
    }
    return next;
  }, {});

  activeIndex = intersection?.object?.index ?? -1;
  if (intersection?.object?.isSelected) {
    intersection.object.material.color.set(failColor);
    setTimeout(() => {
      intersection.object.material.color.set(sucsessColor);
    }, 1000);

    setDefaultState(camera, scene, dialogButton);

    return;
  }

  if (activeIndex != -1) {
    dialogButton.classList.add("show");

    intersection.object.material.color.set("purple");

    scene.remove(scene.getObjectByName("text"));

    const textPosition = [
      intersection.object.basePosition.x + 10,
      intersection.object.basePosition.y,
      intersection.object.basePosition.z,
    ];
    renderText({
      size: 1,
      depth: 0.01,
      curveSegments: 12,
      baseColor,
      camera,
      scene,
      textPosition,
      text: intersection.object.text,
    });
    group.children.forEach((child, index) => {
      camera.position.set(
        0,
        child.basePosition.y + cameraScaleY * floors.length,
        child.basePosition.z + cameraScaleZ * floors.length
      );
      if (index > activeIndex) {
        new TWEEN.Tween(child.position)
          .to(
            {
              x: 0,
              y: child.basePosition.y * 2,
              z: child.basePosition.z,
            },
            Math.random() * 10 + 1000
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }
    });
  } else {
    setDefaultState(camera, scene, dialogButton);
  }
};

canvas.addEventListener("click", handleClick);

dialogButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});
dialog.addEventListener("click", ({ currentTarget, target }) => {
  const dialogElement = currentTarget;
  const isClickedOnBackDrop = target === dialogElement;
  if (isClickedOnBackDrop) {
    dialog.close();
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  group.children[activeIndex].material.color.set(sucsessColor);
  group.children[activeIndex].isSelected = true;
  dialog.close();
  setDefaultState(camera, scene, dialogButton);

  clearIntersections(group, activeIndex);
});
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
});

const tick = () => {
  TWEEN.update();
  control.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
