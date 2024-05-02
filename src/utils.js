import { config } from "./config";
import { floors } from "./data";

const { cameraScaleY, cameraScaleZ } = config;

export const setDefaultState = (camera, scene, dialogButton) => {
  camera.position.set(
    0,
    cameraScaleY * floors.length,
    cameraScaleZ * floors.length
  );
  scene.remove(scene.getObjectByName("text"));
  dialogButton.classList.remove("show");
};
