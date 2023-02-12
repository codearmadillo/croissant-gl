import {Drawable, Vertex} from "../types/graphics";
import {ReadonlyVec3, mat4} from "gl-matrix";
import {VertexArrayObject} from "./vertex-array-object";
import {defaultShader} from "../implementation/shader.default";
import {gl} from "./context";

export abstract class DrawableObject implements Drawable {
  protected readonly model: mat4;
  protected readonly vao: VertexArrayObject;
  public constructor() {
    this.vao = new VertexArrayObject();
    // create default model
    this.model = mat4.create();
    mat4.identity(this.model);
  }
  protected compile() {
    this.vao.addVertices(this.getVertices());
    this.vao.addIndices(this.getIndices());
  }
  protected abstract getVertices(): Vertex[];
  protected abstract getIndices(): number[];
  draw() {
    defaultShader.bind();
    gl().uniformMatrix4fv(defaultShader.getUniformLocation("u_model"), false, this.model);
    this.vao.draw();
  }
  translate(translation: ReadonlyVec3) {
    mat4.fromTranslation(this.model, translation);
  }
  translateX(value: number) {
    mat4.fromTranslation(this.model, [ value, 0, 0 ]);
  }
  translateY(value: number) {
    mat4.fromTranslation(this.model, [ 0, value, 0 ]);
  }
  translateZ(value: number) {
    mat4.fromTranslation(this.model, [ 0, 0, value ]);
  }
  rotateX(deg: number) {
    mat4.fromRotation(this.model, deg * (Math.PI / 180), [ 1, 0, 0 ]);
  }
  rotateY(deg: number) {
    mat4.fromRotation(this.model, deg * (Math.PI / 180), [ 0, 1, 0 ]);
  }
  rotateZ(deg: number) {
    mat4.fromRotation(this.model, deg * (Math.PI / 180), [ 0, 0, 1 ]);
  }
  scale(scale: ReadonlyVec3) {
    mat4.fromScaling(this.model, scale);
  }
}
