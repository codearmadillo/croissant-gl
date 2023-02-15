import {glMatrix, mat4, quat, vec3} from "gl-matrix";
import {gl} from "./context";
import {defaultShader} from "./shader";
import {CameraInfo} from "../types/camera";


class Camera {
  private dirty = true;
  private viewRotationQuat: quat = quat.create();
  private viewRotation: vec3 = [ 0, 0, 0 ];
  private viewTranslation: vec3 = [ 0, 0, 0 ];
  private focalPointTranslation: vec3 = [ 0, 0, 0, ];
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
    this.setCanvasListeners();
  }
  bind() {
    if (this.dirty) {
      quat.fromEuler(this.viewRotationQuat, this.viewRotation[0], this.viewRotation[1], this.viewRotation[2]);
      mat4.fromRotationTranslation(this.viewMatrix, this.viewRotationQuat, this.viewTranslation);
      this.dirty = false;
    }
    // update perspective
    mat4.perspective(this.projectionMatrix, this.perspectiveFov, gl().canvas.width / gl().canvas.height, this.perspectiveNear, this.perspectiveFar);
    // update viewport
    gl().viewport(0, 0, gl().canvas.width, gl().canvas.height);
    // push uniforms
    gl().uniformMatrix4fv(this.viewMatrixLocation, false, this.viewMatrix);
    gl().uniformMatrix4fv(this.projectionMatrixLocation, false, this.projectionMatrix);
  }
  translate(translation: vec3) {
    this.viewTranslation[0] += translation[0];
    this.viewTranslation[1] += translation[1];
    this.viewTranslation[2] += translation[2];
    this.dirty = true;
  }
  rotate(rotation: vec3) {
    this.viewRotation[0] += rotation[0];
    this.viewRotation[1] += rotation[1];
    this.viewRotation[2] += rotation[2];
    this.dirty = true;
  }
  setTranslation(translation: vec3) {
    this.viewTranslation[0] = translation[0];
    this.viewTranslation[1] = translation[1];
    this.viewTranslation[2] = translation[2];
    this.dirty = true;
  }
  setRotation(rotation: vec3) {
    this.viewRotation[0] = rotation[0];
    this.viewRotation[1] = rotation[1];
    this.viewRotation[2] = rotation[2];
    this.dirty = true;
  }
  translateFocalPoint(translation: vec3) {
    this.focalPointTranslation[0] = translation[0];
    this.focalPointTranslation[1] = translation[1];
    this.focalPointTranslation[2] = translation[2];
    this.dirty = true;
  }
  setFocalPointTranslation(translation: vec3) {
    this.focalPointTranslation[0] = translation[0];
    this.focalPointTranslation[1] = translation[1];
    this.focalPointTranslation[2] = translation[2];
    this.dirty = true;
  }
  perspective(fovDegrees: number, near: number, far: number) {
    this.perspectiveFov = glMatrix.toRadian(fovDegrees);
    this.perspectiveNear = near;
    this.perspectiveFar = far;
    this.dirty = true;
  }
  isDirty() {
    return this.dirty;
  }
  info(): CameraInfo {
    return {
      translation: [ this.viewTranslation[0], this.viewTranslation[1], this.viewTranslation[2] ],
      rotation: [ this.viewRotation[0], this.viewRotation[1], this.viewRotation[2] ],
      clipFar: this.perspectiveFar,
      clipNear: this.perspectiveNear,
      angle: this.perspectiveFov,
      focalPoint: this.focalPointTranslation
    }
  }

  private setCanvasListeners() {
    gl().canvas.addEventListener("wheel", (e) => {
      if (e.deltaY < 0) {
        console.log("ZOOM IN");
      } else {
        console.log("ZOOM OUT");
      }
    });
  }
}
export const defaultCamera = new Camera();
