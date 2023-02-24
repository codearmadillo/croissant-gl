import {vec2, vec3} from "gl-matrix";

type PlaneCreateOptions = {
  type: "plane",
  size: vec2,
  position?: vec3,
  rotation?: vec3,
  scale?: vec3,
}
type CubeCreateOptions = {
  type: "cube",
  size: vec3,
  position?: vec3,
  rotation?: vec3,
  scale?: vec3,
}
export type ObjectCreateOptions = PlaneCreateOptions | CubeCreateOptions;
