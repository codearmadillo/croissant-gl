import {vec2, vec3} from "gl-matrix";

interface ObjFileParts {
  vertices: vec3[];
  normals: vec3[];
  textureCoordinates: vec2[];
}
export class ObjLoader {
  static async load(filePath: string): Promise<void> {
    const fileContents = await fetch(filePath);
    const fileText = await fileContents.text();

    const parts: ObjFileParts = {
      vertices: [],
      normals: [],
      textureCoordinates: []
    }

    fileText.split("\n").forEach((line) => {
      // console.log(line);
    });
  }
}
