import {vec3} from "gl-matrix";

type DrawableCubeType = {
    type: "cube",
    position: vec3,
    rotation: vec3,
    scale: vec3,
    size: vec3
}

export type DrawableType = DrawableCubeType;