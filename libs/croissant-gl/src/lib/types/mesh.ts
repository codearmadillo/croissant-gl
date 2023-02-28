import {vec3, vec4} from "gl-matrix";

export type MeshMaterialIllumination = 0 | 1 | 2;

export interface MeshMaterial {
    name: string;
    specularExponent: number;
    illumination: MeshMaterialIllumination;
    ambient: vec3;
    diffuse: vec3;
    specular: vec3;
}

export interface MeshFace {
    materialName: string;
    vertices: (number | null)[];
    normals: (number | null)[];
    textureCoordinates: (number | null)[];
    debug: string;
}

export interface MeshObject {
    name: string;
    vertices: vec4[];
    normals: vec3[];
    texCoords: vec3[];
    faces: MeshFace[];
}

export interface Mesh {
    materials: MeshMaterial[];
    objects: MeshObject[];
    materialSource: string | null;
    count: number;
}
