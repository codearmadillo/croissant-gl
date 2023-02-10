import {Drawable, Vertex} from "../lib/types/graphics";
import {VertexArrayObject} from "../lib/graphics/vertex-array-object";
import * as glMatrix from "gl-matrix";
import {defaultShader} from "../lib/implementation/shader.default";
import {gl} from "../lib/graphics/context";
import {ReadonlyVec3} from "gl-matrix";

abstract class DrawableObject implements Drawable {
  protected readonly model: glMatrix.mat4;
  protected readonly vao: VertexArrayObject;
  public constructor() {
    this.vao = new VertexArrayObject();
    // create default model
    this.model = glMatrix.mat4.create();
    glMatrix.mat4.identity(this.model);
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
    glMatrix.mat4.fromTranslation(this.model, translation);
  }
  translateX(value: number) {
    glMatrix.mat4.fromTranslation(this.model, [ value, 0, 0 ]);
  }
  translateY(value: number) {
    glMatrix.mat4.fromTranslation(this.model, [ 0, value, 0 ]);
  }
  translateZ(value: number) {
    glMatrix.mat4.fromTranslation(this.model, [ 0, 0, value ]);
  }
  rotateX(deg: number) {
    glMatrix.mat4.fromRotation(this.model, deg * (Math.PI / 180), [ 1, 0, 0 ]);
  }
  rotateY(deg: number) {
    glMatrix.mat4.fromRotation(this.model, deg * (Math.PI / 180), [ 0, 1, 0 ]);
  }
  rotateZ(deg: number) {
    glMatrix.mat4.fromRotation(this.model, deg * (Math.PI / 180), [ 0, 0, 1 ]);
  }
  scale(scale: ReadonlyVec3) {
    glMatrix.mat4.fromScaling(this.model, scale);
  }
}

export class Rect extends DrawableObject {
  private readonly size: glMatrix.vec2;
  constructor(size: glMatrix.vec2) {
    super();
    this.size = size;
    this.compile();
  }
  protected getVertices(): Vertex[] {
    return [
      new Vertex([  0.5, -0.5, 0 ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([  0.5, 0.5, 0, ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ -0.5, 0.5, 0, ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -0.5, -0.5, 0 ], [ 1.0, 0.0, 1.0 ])
    ];
  }
  protected getIndices(): number[] {
    return [
      0, 1, 2,
      0, 2, 3
    ];
  }
}
