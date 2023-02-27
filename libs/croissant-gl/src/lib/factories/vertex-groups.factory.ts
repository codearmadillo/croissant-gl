import {CubeCreateOptions, ObjectCreateOptions, ObjMeshCreateOptions, PlaneCreateOptions} from "../types/drawables";
import {VertexGroup} from "../graphics/vertex-group";
import {getCubeVerticesIndices, getPlaneVerticesIndices} from "../graphics/drawables";
import {VertexArrayObject} from "../graphics/vertex-array-object";
import {ShaderType} from "../types/graphics";
import {vec3, vec4} from "gl-matrix";
import {Mesh} from "../types/mesh";

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
                    color: [ 170, 170, 170 ],
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
                    color: [ 170, 170, 170 ],
                    shader: ShaderType.OBJECT_SHADER,
                    texture: null
                }
            }
        ];
    }
    public static async getObjMeshVertexGroups(options: ObjMeshCreateOptions, parsedObjFile: Mesh, glContext: WebGL2RenderingContext): Promise<VertexGroup[]> {

        console.log(parsedObjFile);

        return this.getPlaneVertexGroups({
            type: "plane",
            size: [ 100, 100 ]
        }, glContext);
    }
}
