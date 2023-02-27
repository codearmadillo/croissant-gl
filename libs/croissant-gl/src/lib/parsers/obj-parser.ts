import {vec3, vec4} from "gl-matrix";
import {Mesh, MeshFace, MeshMaterial} from "../types/mesh";
import {isEmptyOrWhitespace} from "../helpers/type.helpers";

export class ObjParser {
    public static async parse(filePath: string): Promise<Mesh> {
        const file = await fetch(filePath);
        if (!file.ok) {
            throw new Error(`Failed to load '${filePath}'`);
        }
        const fileContents = await file.text();
        // Parse file
        const objFile = await this.parseObjFile(fileContents);
        // Load material file, if any
        if (objFile.materialSource !== null) {
            const fileDirectory = filePath.split("/").filter((i, j, a) => j !== a.length - 1).join("/");
            const materialFilePath = `${fileDirectory}/${objFile.materialSource}`;
            const materialFile = await fetch(materialFilePath);
            if (materialFile.ok) {
                const materialFileContents = await materialFile.text();
                objFile.materials = await this.parseMaterialFile(materialFileContents);
            } else {
                console.error(`Failed to load material file for '${filePath}' (${materialFilePath})`);
            }
        }
        return objFile;
    }
    private static async parseMaterialFile(fileContents: string): Promise<MeshMaterial[]> {
        // https://people.computing.clemson.edu/~dhouse/courses/405/docs/brief-mtl-file-format.html#:~:text=Material%20Library%20File%20(.mtl),mtl%20extension.
        return [];
    }
    private static async parseObjFile(fileContents: string): Promise<Mesh> {
        // // Docs: https://en.wikipedia.org/wiki/Wavefront_.obj_file
        // Create base response
        const objFile: Mesh = {
            materials: [],
            objects: [],
            materialSource: null,
            count: 0
        }
        // Keep track of captured material
        let usedMaterial: string | null = null;
        // Parse line by line
        fileContents.split("\n").forEach((line) => {
            if (line.startsWith("usemtl ")) {
                usedMaterial = line.split(" ").filter((j, i) => i !== 0).join(" ").trim();
                return;
            }
            if (line.startsWith("mtllib ")) {
                objFile.materialSource = line.split(" ").filter((j, i) => i !== 0).join(" ").trim();
                return;
            }
            if (line.startsWith("o ")) {
                objFile.objects.push({
                    name: line.split(" ").filter((j, i) => i !== 0).join(" "),
                    vertices: [],
                    normals: [],
                    texCoords: [],
                    faces: []
                });
                objFile.count++;
                return;
            }
            // Establish index - cannot read line if no object is currently bound
            if (objFile.count === 0) {
                return;
            }
            const index = objFile.count - 1;

            // Prepare exploded value
            const explodedValues = line.split(" ").filter((j, i) => i !== 0).map((v) => v.trim());

            // Vertices
            if (line.startsWith("v ")) {
                objFile.objects[index].vertices.push([
                    parseFloat(explodedValues[0]), parseFloat(explodedValues[1]), parseFloat(explodedValues[2]), parseFloat(explodedValues[3] ?? "1.0")
                ]);
                return;
            }

            // Normals
            if (line.startsWith("vn ")) {
                const normalVec: vec3 = [ parseFloat(explodedValues[0]), parseFloat(explodedValues[1]), parseFloat(explodedValues[2]) ];
                objFile.objects[index].normals.push(vec3.normalize(vec3.create(), normalVec));
                return;
            }

            // Texture coordinates
            if (line.startsWith("vt" )) {
                objFile.objects[index].texCoords.push([
                    parseFloat(explodedValues[0]),
                    parseFloat(explodedValues[1] ?? 0 ),
                    parseFloat(explodedValues[2] ?? 0)
                ]);
                return;
            }

            // Faces
            if (line.startsWith("f ")) {
                const face: MeshFace = {
                    materialName: usedMaterial as string,
                    debug: line,
                    vertices: [],
                    textureCoordinates: [],
                    normals: []
                }

                explodedValues.forEach((valueString, i) => {
                    // Parse value
                    valueString = valueString.trim();
                    const value = valueString.split("/");
                    // If no / are present, the value is vertex only
                    face.vertices[i] = parseInt(value[0].trim(), 10);
                    face.textureCoordinates[i] = isEmptyOrWhitespace(value[1]) ? null : parseInt(value[1].trim(), 10);
                    face.normals[i] = isEmptyOrWhitespace(value[2]) ? null : parseInt(value[2].trim(), 10)
                });

                objFile.objects[index].faces.push(face);
                return;
            }
        });
        // Return parsed file
        return objFile;
    }
}
