import {Drawable, Vertex} from "../lib/types/graphics";
import {VertexArrayObject} from "../lib/graphics/vertex-array-object";

export abstract class Cube implements Drawable {
  protected readonly vao: VertexArrayObject;
  public constructor() {
    this.vao = new VertexArrayObject();
    this.vao.addVertices([
      new Vertex([+0.5, -0.5, +0.5], [1.0, 0.0, 0.0]),
      new Vertex([+0.5, +0.5, +0.5], [0.0, 1.0, 0.0]),
      new Vertex([-0.5, +0.5, +0.5], [0.0, 0.0, 1.0]),
      new Vertex([-0.5, -0.5, +0.5], [1.0, 1.0, 0.0]),
      new Vertex([+0.5, -0.5, -0.5], [1.0, 0.0, 1.0]),
      new Vertex([+0.5, +0.5, -0.5], [0.0, 1.0, 1.0]),
      new Vertex([-0.5, +0.5, -0.5], [1.0, 0.5, 1.0]),
      new Vertex([-0.5, +0.5, +0.5], [1.0, 1.0, 5.0]),
    ]);
    this.vao.addIndices([
      0, 1, 2,
      0, 2, 3,
      0, 4, 5,
      0, 5, 1,
      7, 4, 5,
      7, 5, 6,
      7, 3, 2,
      7, 6, 2,
      0, 4, 7,
      0, 7, 3,
      1, 5, 6,
      1, 6, 2
    ]);
  }
  draw() {
    this.vao.draw();
  }
}

export abstract class Square implements Drawable {
  protected readonly vao: VertexArrayObject;
  public constructor() {
    this.vao = new VertexArrayObject();
    this.vao.addVertices([
      new Vertex([  0.5, -0.5, 0 ], [ 1.0, 0.0, 0.0 ]),
      new Vertex([  0.5, 0.5, 0, ], [ 0.0, 1.0, 0.0 ]),
      new Vertex([ -0.5, 0.5, 0, ], [ 0.0, 0.0, 1.0 ]),
      new Vertex([ -0.5, -0.5, 0 ], [ 1.0, 0.0, 1.0 ])
    ]);
    this.vao.addIndices([
      0, 1, 2,
      0, 2, 3
    ]);
  }
  draw() {
    this.vao.draw();
  }
}

