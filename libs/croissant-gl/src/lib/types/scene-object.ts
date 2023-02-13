import { vec3 } from "gl-matrix";

/**
 * Public API object
 */
import {ReadonlyVec3} from "gl-matrix";

export interface SceneObject {
  translate(translation: ReadonlyVec3): void;
  translateX(value: number): void;
  translateY(value: number): void;
  translateZ(value: number): void;
  rotate(rotation: ReadonlyVec3): void;
  rotateX(deg: number): void;
  rotateY(deg: number): void;
  rotateZ(deg: number): void;
  scale(scale: ReadonlyVec3): void;
  enable(): void;
  disable(): void;
  readonly type: string;
  readonly enabled: boolean;
  readonly id: number;
  readonly translation: vec3;
  readonly rotation: vec3;
}
