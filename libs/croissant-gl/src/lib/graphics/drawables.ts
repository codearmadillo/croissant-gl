import {DrawableType} from "./drawable-type";
import {Vertex} from "../types/graphics";
import {vec2, vec3} from "gl-matrix";

export function getCubeVerticesIndices(size: vec3, position: vec3, color: vec3): [ Vertex[], number[] ] {
  return [
    [
      // bottom
      new Vertex([ -size[0] / 2 + position[0], -size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 0, -1, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0],  -size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 0, -1, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0],  -size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ 0, -1, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ -size[0] / 2 + position[0], -size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ 0, -1, 0 ], [ color[0], color[1], color[2], 1 ] ),
      // top
      new Vertex([ -size[0] / 2 + position[0], size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 0, 1, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0],  size[1] / 2 + position[1],   -size[2] / 2 + position[2] ], [ 0, 1, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0],  size[1] / 2 + position[1],   size[2] / 2 + position[2] ], [ 0, 1, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ -size[0] / 2 + position[0], size[1] / 2 + position[1],   size[2] / 2 + position[2] ], [ 0, 1, 0 ], [ color[0], color[1], color[2], 1 ] ),
      // left
      new Vertex([ -size[0] / 2 + position[0], -size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ -1, 0, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ -size[0] / 2 + position[0], -size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ -1, 0, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ -size[0] / 2 + position[0], size[1] / 2 + position[1],   size[2] / 2 + position[2] ], [ -1, 0, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ -size[0] / 2 + position[0], size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ -1, 0, 0 ], [ color[0], color[1], color[2], 1 ] ),
      // right
      new Vertex([ size[0] / 2 + position[0], -size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 1, 0, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0], -size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ 1, 0, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0], size[1] / 2 + position[1],   size[2] / 2 + position[2] ], [ 1, 0, 0 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0], size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 1, 0, 0 ], [ color[0], color[1], color[2], 1 ] ),
      // front
      new Vertex([ -size[0] / 2 + position[0], -size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 0, 0, -1 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0],  -size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 0, 0, -1 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0],  size[1] / 2 + position[1],   -size[2] / 2 + position[2] ], [ 0, 0, -1 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ -size[0] / 2 + position[0], size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 0, 0, -1 ], [ color[0], color[1], color[2], 1 ] ),
      // back
      new Vertex([ -size[0] / 2 + position[0], -size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ 0, 0, 1 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0],  -size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ 0, 0, 1 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ size[0] / 2 + position[0],  size[1] / 2 + position[1],   size[2] / 2 + position[2] ], [ 0, 0, 1 ], [ color[0], color[1], color[2], 1 ] ),
      new Vertex([ -size[0] / 2 + position[0], size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ 0, 0, 1 ], [ color[0], color[1], color[2], 1 ] ),
    ],
    [
      // bottom
      0, 1, 2,
      0, 2, 3,
      // top
      4, 5, 6,
      4, 6, 7,
      // left
      8, 9, 10,
      8, 10, 11,
      // right
      12, 13, 14,
      12, 14, 15,
      // front
      16, 17, 18,
      16, 18, 19,
      // back
      20, 21, 22,
      20, 22, 23
    ]
  ];
}

export function getPlaneVerticesIndices(size: vec2, position: vec3, color: vec3): [ Vertex[], number[] ] {

  return [
    [
      new Vertex([ -size[0] / 2 + position[0], position[1],  -size[1] / 2 + position[1] ], [ 0, 1, 0 ], [ color[0], color[1], color[2], 1.0 ]),
      new Vertex([ size[0] / 2 + position[0],  position[1],  -size[1] / 2 + position[1] ], [ 0, 1, 0 ], [ color[0], color[1], color[2], 1.0 ]),
      new Vertex([ size[0] / 2 + position[0],  position[1],  size[1] / 2 + position[1] ], [ 0, 1, 0 ], [ color[0], color[1], color[2], 1.0 ]),
      new Vertex([ -size[0] / 2 + position[0], position[1],  size[1] / 2 + position[1] ], [ 0, 1, 0 ], [ color[0], color[1], color[2], 1.0 ]),
    ],
    [
      0, 1, 2,
      0, 2, 3,
    ]
  ]
}
