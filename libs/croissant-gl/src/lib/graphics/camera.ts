import {defaultShader} from "../implementation/shader.default";
import {glMatrix, mat4} from "gl-matrix";
import {gl} from "./context";

class Camera {
  private perspectiveFov = 45;
  private perspectiveNear = 0.1;
  private perspectiveFar = 1000;
  private viewMatrixLocation: WebGLUniformLocation | null = null;
  private projectionMatrixLocation: WebGLUniformLocation | null = null;
  private readonly viewMatrix: mat4;
  private readonly projectionMatrix: mat4;
  constructor() {
    this.viewMatrix = mat4.create();
    mat4.identity(this.viewMatrix);

    this.projectionMatrix = mat4.create();
    mat4.identity(this.projectionMatrix);
  }
  // called when shaders are ready
  bootstrap() {
    this.viewMatrixLocation = defaultShader.getUniformLocation("u_view");
    this.projectionMatrixLocation = defaultShader.getUniformLocation("u_projection");
  }
  bind() {
    // update perspective
    mat4.perspective(this.projectionMatrix, this.perspectiveFov, gl().canvas.width / gl().canvas.height, this.perspectiveNear, this.perspectiveFar);
    // update viewport
    gl().viewport(0, 0, gl().canvas.width, gl().canvas.height);
    // push uniforms
    gl().uniformMatrix4fv(this.viewMatrixLocation, false, this.viewMatrix);
    gl().uniformMatrix4fv(this.projectionMatrixLocation, false, this.projectionMatrix);
  }
  translate(x: number, y: number, z: number) {
    mat4.fromTranslation(this.viewMatrix, [ x, y, z ]);
  }
  rotateX(degrees: number) {
    mat4.fromXRotation(this.viewMatrix, glMatrix.toRadian(degrees));
  }
  rotateY(degrees: number) {
    mat4.fromYRotation(this.viewMatrix, glMatrix.toRadian(degrees));
  }
  rotateZ(degrees: number) {
    mat4.fromZRotation(this.viewMatrix, glMatrix.toRadian(degrees));
  }
  rotate(xDegrees: number, yDegrees: number, zDegrees: number) {
    this.rotateX(xDegrees);
    this.rotateY(yDegrees);
    this.rotateZ(zDegrees);
  }
  setPerspectiveFov(degrees: number) {
    this.perspectiveFov = glMatrix.toRadian(degrees);
  }
  setPerspectiveNear(value: number) {
    this.perspectiveNear = value;
  }
  setPerspectiveFar(value: number) {
    this.perspectiveFar = value;
  }
}
export const defaultCamera = new Camera();
