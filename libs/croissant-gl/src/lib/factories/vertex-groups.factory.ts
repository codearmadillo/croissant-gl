import {CubeCreateOptions, ObjMeshCreateOptions, PlaneCreateOptions} from "../types/drawables";
import {VertexGroup} from "../graphics/vertex-group";
import {getCubeVerticesIndices, getPlaneVerticesIndices} from "../graphics/drawables";
import {VertexArrayObject} from "../graphics/vertex-array-object";
import {ShaderType, Vertex} from "../types/graphics";
import {Mesh} from "../types/mesh";
import {isNullOrUndefined} from "../helpers/type.helpers";

export class VertexGroupsFactory {
    public static async getCubeVertexGroups(options: CubeCreateOptions, glContext: WebGL2RenderingContext): Promise<VertexGroup[]> {
    const [ vertices, indices ] = getCubeVerticesIndices(options.size, options.position);
    const vao = new VertexArrayObject(glContext);
    vao.addVertices(vertices);
    vao.addIndices(indices);
        return [
            {
                vao,
                material: {
                    diffuse: [ 170, 170, 170 ],
                    specular: [ 255, 255, 255 ],
                    ambient: [ 255, 255, 255 ],
                    specularExponent: 0,
                    illumination: 0,
                    shader: ShaderType.OBJECT_SHADER,
                    texture: null
                }
            }
        ];
    }

    public static async getPlaneVertexGroups(options: PlaneCreateOptions, glContext: WebGL2RenderingContext): Promise<VertexGroup[]> {
        const [ vertices, indices ] = getPlaneVerticesIndices(options.size, options.position);
        const vao = new VertexArrayObject(glContext);
        vao.addVertices(vertices);
        vao.addIndices(indices);
        return [
            {
                vao,
                material: {
                    diffuse: [ 170, 170, 170 ],
                    specular: [ 255, 255, 255 ],
                    ambient: [ 255, 255, 255 ],
                    specularExponent: 0,
                    illumination: 0,
                    shader: ShaderType.OBJECT_SHADER,
                    texture: null
                }
            }
        ];
    }
    public static async getObjMeshVertexGroups(options: ObjMeshCreateOptions, parsedObjFile: Mesh, glContext: WebGL2RenderingContext): Promise<VertexGroup[]> {
        // TODO: Merge faces with identical materials
        const groups: VertexGroup[] = [];

        parsedObjFile.objects.forEach((object) => {
            object.faces.forEach((face) => {
                // vertex group vertices/indices
                const vertices: Vertex[] = [];
                let indices: number[] = [];

                // it is ensured that face vertices/normals/texCoords have the same amount of elements
                face.vertices.forEach((vertexIndex, i) => {
                    if (vertexIndex === null || isNullOrUndefined(object.vertices[vertexIndex])) {
                        console.warn("Skipping vertex");
                        return;
                    }
                    const normalIndex = face.normals[i];
                    const texCoordIndex = face.normals[i];

                    const vertex = object.vertices[vertexIndex];
                    const normal = isNullOrUndefined(normalIndex) ? null : object.normals[normalIndex as number];
                    const texCoord = isNullOrUndefined(texCoordIndex) ? null : object.texCoords[texCoordIndex as number];

                    // create vertex
                    vertices.push(new Vertex([ vertex[0], vertex[1], vertex[2] ], {
                        normals: isNullOrUndefined(normal) ? null : [ normal![0], normal![1], normal![2] ],
                        textureCoordinates: isNullOrUndefined(texCoord) ? null : [ texCoord![0], texCoord![1] ]
                    }));
                });

                // TODO: Triangulation
                if (face.vertices.length === 3) {
                    indices = [ 0, 1, 2 ];
                } else if (face.vertices.length > 3) {
                    indices = [ 0, 1, 2, 0, 2, 3 ];
                }

                // create vao
                const vao = new VertexArrayObject(glContext);
                vao.addVertices(vertices);
                vao.addIndices(indices);

                // create group
                const group: VertexGroup = {
                    material: {
                        diffuse: [ 170, 170, 170 ],
                        specular: [ 255, 255, 255 ],
                        ambient: [ 255, 255, 255 ],
                        specularExponent: 0,
                        illumination: 0,
                        shader: ShaderType.OBJECT_SHADER,
                        texture: null
                    },
                    vao
                }

                // find material and override default material values
                const material = parsedObjFile.materials.find((mat) => mat.name === face.materialName);

                if (!isNullOrUndefined(material)) {
                    group.material.diffuse = material!.diffuse;
                    group.material.specular = material!.specular;
                    group.material.ambient = material!.ambient;
                    group.material.specularExponent = material!.specularExponent;
                    group.material.illumination = material!.illumination;
                }

                groups.push(group);
            });
        });

        return groups;
    }
}
