import {DrawableType} from "./drawable-type";
import {Vertex} from "../types/graphics";
import {vec3} from "gl-matrix";

export function getCubeVerticesIndices(size: vec3, position: vec3): [ Vertex[], number[] ] {
    return [
        [
            new Vertex([ -size[0] / 2 + position[0], -size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 1.0, 0.0, 0.0 ]),
            new Vertex([ size[0] / 2 + position[0],  -size[1] / 2 + position[1],  -size[2] / 2 + position[2] ], [ 0.0, 1.0, 0.0 ]),
            new Vertex([ size[0] / 2 + position[0],  -size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ 0.0, 0.0, 1.0 ]),
            new Vertex([ -size[0] / 2 + position[0], -size[1] / 2 + position[1],  size[2] / 2 + position[2] ], [ 1.0, 0.0, 1.0 ]),
            new Vertex([ -size[0] / 2 + position[0], size[1] / 2 + position[1],   -size[2] / 2 + position[2] ], [ 1.0, 0.0, 0.0 ]),
            new Vertex([ size[0] / 2 + position[0],  size[1] / 2 + position[1],   -size[2] / 2 + position[2] ], [ 0.0, 1.0, 0.0 ]),
            new Vertex([ size[0] / 2 + position[0],  size[1] / 2 + position[1],   size[2] / 2 + position[2] ], [ 0.0, 0.0, 1.0 ]),
            new Vertex([ -size[0] / 2 + position[0], size[1] / 2 + position[1],   size[2] / 2 + position[2] ], [ 1.0, 0.0, 1.0 ])
        ],
        [
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
        ]
    ]
}

export function getVerticesIndices(type: DrawableType): [ Vertex[], number[] ] {
    switch(type.type) {
        case "cube":
            return getCubeVerticesIndices(type.size, type.position);
    }
}