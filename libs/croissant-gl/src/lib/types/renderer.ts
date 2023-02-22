import {VertexArrayObject} from "../graphics/vertex-array-object";
import {vec3} from "gl-matrix";

export interface Axis {
    orientation: vec3;
    vao: VertexArrayObject;
    enabled: boolean;
}
export interface RendererStatistics {
    passes: number;
    totalRenderTimeInMs: number;
}