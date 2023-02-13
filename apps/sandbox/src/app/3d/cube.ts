import { croissantDrawables } from "@webgl2/croissant-gl";

export class FancyCube extends croissantDrawables.Cube {
  constructor(size: [number, number, number]) {
    super(size, [ 0, 0, -100 ]);
  }
  frame(deltaTime: number) { }
}
