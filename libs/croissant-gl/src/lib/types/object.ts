import {vec3} from "gl-matrix";

export interface ObjectInfo {
  id: number;
  type: string | null;
  translation: vec3 | null;
  rotation: vec3 | null;
  scale: vec3 | null;
  enabled: boolean;
}