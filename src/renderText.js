import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
const renderText = (properties) => {
  const {
    size,
    depth,
    curveSegments,
    baseColor,
    camera,
    scene,
    textPosition,
    text,
  } = properties;
  const loader = new FontLoader();
  loader.load("fonts/Roboto_Regular.json", function (font) {
    const textGeometry = new TextGeometry(`${text.toLowerCase()}`, {
      font: font,
      size: size,
      depth: depth,
      curveSegments: curveSegments,
    });
    const material = new THREE.MeshStandardMaterial({
      color: baseColor,
    });
    const mesh = new THREE.Mesh(textGeometry, material);
    mesh.position.set(...textPosition);
    mesh.lookAt(camera.position);
    mesh.name = "text";
    scene.add(mesh);
  });
};
export default renderText;
