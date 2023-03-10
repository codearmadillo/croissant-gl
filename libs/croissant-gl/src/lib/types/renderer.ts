import {VertexArrayObject} from "../graphics/vertex-array-object";
import {vec3} from "gl-matrix";

export interface Gimbal {
  lines: VertexArrayObject;
  bubbles: VertexArrayObject;
  enabled: boolean;
}
export interface Axis {
    orientation: vec3;
    vao: VertexArrayObject;
    enabled: boolean;
    color: vec3;
}
export interface RendererStatistics {
    passes: number;
    totalRenderTimeInMs: number;
}
