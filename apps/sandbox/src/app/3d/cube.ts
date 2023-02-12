import { croissantDrawables } from "@webgl2/croissant-gl";

export class FancyCube extends croissantDrawables.Cube {
  constructor(size: [number, number, number]) {
    super(size);
  }
  frame(deltaTime: number) {
    this.rotateX(5 * deltaTime);
  }
}
