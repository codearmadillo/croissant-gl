import {CubeCreateOptions, ObjectCreateOptions, ObjMeshCreateOptions, PlaneCreateOptions} from "../types/drawables";
import {VertexGroup} from "../graphics/vertex-group";
import {getCubeVerticesIndices, getPlaneVerticesIndices} from "../graphics/drawables";
import {VertexArrayObject} from "../graphics/vertex-array-object";
import {ShaderType} from "../types/graphics";

export class VertexGroupsFactory {
  static async getVertexGroups(options: ObjectCreateOptions, glContext: WebGL2RenderingContext) {
    switch (options.type) {
      case "cube":
        return this.getCubeVertexGroups(options, glContext);
      case "plane":
        return this.getPlaneVertexGroups(options, glContext);
      case "objMesh":
        return this.getObjMeshVertexGroups(options, glContext);
    }
    throw new Error(`Unhandled: Cannot establish vertex groups for type '${(options as any)?.type}'`);
  }
  private static async getCubeVertexGroups(options: CubeCreateOptions, glContext: WebGL2RenderingContext): Promise<VertexGroup[]> {
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
  private static async getPlaneVertexGroups(options: PlaneCreateOptions, glContext: WebGL2RenderingContext): Promise<VertexGroup[]> {
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
  private static async getObjMeshVertexGroups(options: ObjMeshCreateOptions, glContext: WebGL2RenderingContext): Promise<VertexGroup[]> {
    return [];
  }
}
