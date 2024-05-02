import TWEEN from "three/examples/jsm/libs/tween.module";
import { config } from "./config";

const { baseColor } = config;

const clearIntersections = (group, activeIndex) => {
  group.children.forEach((item) => {
    if (!item.isSelected) {
      item.material.color.set(baseColor);
    }
  });
  if (activeIndex != -1) {
    group.children.forEach((child, index) => {
      if (index != activeIndex) {
        new TWEEN.Tween(child.position)
          .to(
            {
              x: child.basePosition.x,
              y: child.basePosition.y,
              z: child.basePosition.z,
            },
            Math.random() * 10 + 1000
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }
    });
  }
};

export default clearIntersections;
