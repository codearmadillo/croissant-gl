import {gl} from "./renderer/context";
import {defaultShader} from "./example/default-shader";
import {Square} from "./example/square";

if (gl === null || gl === undefined) {
  throw new Error(`WebGl2 is not supported`);
}

defaultShader.bind();

gl.clearColor(1, 1, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

const mySquare = new Square();
mySquare.draw();

