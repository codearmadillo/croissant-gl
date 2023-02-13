import { Drawable } from "../../types/drawable";
import {mat4, vec3} from "gl-matrix";
import {VertexArrayObject} from "../vertex-array-object";
import {Vertex} from "../../types/graphics";
import {defaultShader} from "../shader";
import {gl} from "../context";
import {BaseSceneObject} from "../../types/object";


export class Cube extends BaseSceneObject implements Drawable {
  private readonly size: vec3;
  private readonly initialPosition: vec3;
  public get type() {
    return "cube";
  }
  constructor(size: vec3, position: vec3 = [ 0, 0, 0 ], rotation: vec3 = [ 0, 0, 0 ]) {
    super(position, rotation);

    this.vao = new VertexArrayObject();

    this.size = size;
    this.initialPosition = position;

    this.vao.addVertices(this.getVertices());
    this.vao.addIndices(this.getIndices());
  }
  private getVertices(): Vertex[] {
    return [
      new Vertex([ -this.size[0] / 2 + this.initialPosition[0], -this.size[1] / 2 + this.initialPosition[1],  -this.size[2] / 2 + this.initialPosition[2] ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([ this.size[0] / 2 + this.initialPosition[0],  -this.size[1] / 2 + this.initialPosition[1],  -this.size[2] / 2 + this.initialPosition[2] ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ this.size[0] / 2 + this.initialPosition[0],  -this.size[1] / 2 + this.initialPosition[1],  this.size[2] / 2 + this.initialPosition[2] ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -this.size[0] / 2 + this.initialPosition[0], -this.size[1] / 2 + this.initialPosition[1],  this.size[2] / 2 + this.initialPosition[2] ], [ 1.0, 0.0, 1.0 ]),
      new Vertex([ -this.size[0] / 2 + this.initialPosition[0], this.size[1] / 2 + this.initialPosition[1],   -this.size[2] / 2 + this.initialPosition[2] ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([ this.size[0] / 2 + this.initialPosition[0],  this.size[1] / 2 + this.initialPosition[1],   -this.size[2] / 2 + this.initialPosition[2] ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ this.size[0] / 2 + this.initialPosition[0],  this.size[1] / 2 + this.initialPosition[1],   this.size[2] / 2 + this.initialPosition[2] ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -this.size[0] / 2 + this.initialPosition[0], this.size[1] / 2 + this.initialPosition[1],   this.size[2] / 2 + this.initialPosition[2] ], [ 1.0, 0.0, 1.0 ])
    ];
  }
  private getIndices(): number[] {
    return [
      0, 1, 2,
      0, 2, 3,

      4, 5, 6,
      4, 6, 7,

      0, 4, 5,
      0, 5, 1,

      0, 3, 4,
      3, 4, 7,

      1, 2, 6,
      1, 5, 6,

      2, 3, 6,
      3, 7, 6
    ];
  }
}
