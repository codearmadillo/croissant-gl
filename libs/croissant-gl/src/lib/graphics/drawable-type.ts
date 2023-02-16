import {vec2, vec3} from "gl-matrix";

type TransformableType = {
  position: vec3,
  rotation: vec3,
  scale: vec3,
}

type DrawableCubeType = TransformableType & {
    type: "cube",
    size: vec3,
    color: vec3
}
type DrawablePlaneType = TransformableType & {
  type: "plane",
  size: vec2,
  color: vec3
}

export type DrawableType = DrawableCubeType | DrawablePlaneType;
