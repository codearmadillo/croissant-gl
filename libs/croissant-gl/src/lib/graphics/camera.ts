import {glMatrix, mat4, quat, ReadonlyVec3, vec3} from "gl-matrix";
import {gl} from "./context";
import {defaultShader} from "./shader";
import {CameraInfo} from "../types/camera";

class Camera {
  private dirty = true;
  private viewDistance = 200;
  private viewOrbit = 0;
  private viewHeight = 50;
  private focalPointTranslation: vec3 = [ 0, 0, 0, ];
  private perspectiveFov = 45;
  private perspectiveNear = 0.1;
  private perspectiveFar = 1000;
  private viewMatrixLocation: WebGLUniformLocation | null = null;
  private projectionMatrixLocation: WebGLUniformLocation | null = null;
  private viewMatrix: mat4;
  private projectionMatrix: mat4;
  private mode: 'perspective' | 'orthographic' = 'perspective';
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
      // update projection
      if (this.mode === "perspective") {
        this.projectionMatrix = mat4.perspective(mat4.create(), this.perspectiveFov, gl().canvas.width / gl().canvas.height, this.perspectiveNear, this.perspectiveFar);
      } else {
        this.projectionMatrix = mat4.ortho(mat4.create(), 0, gl().canvas.width, gl().canvas.height, 0, this.perspectiveNear, this.perspectiveFar);
      }
      // update camera
      {
        const upVector: vec3 = [ 0, 1, 0 ];
        const [ cameraX, cameraZ ] = [ Math.cos(this.viewOrbit), Math.sin(this.viewOrbit) ];

        const cameraPosition: ReadonlyVec3 = [ cameraX * this.viewDistance, this.viewHeight, cameraZ * this.viewDistance ];
        const cameraView = mat4.fromTranslation(mat4.create(), cameraPosition);

        this.viewMatrix = mat4.lookAt(cameraView, cameraPosition, this.focalPointTranslation, upVector);
      }
      // set recalculate flag to false
      this.dirty = false;
    }

    // update viewport
    gl().viewport(0, 0, gl().canvas.width, gl().canvas.height);
    // push uniforms
    gl().uniformMatrix4fv(this.viewMatrixLocation, false, this.viewMatrix);
    gl().uniformMatrix4fv(this.projectionMatrixLocation, false, this.projectionMatrix);
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
  setClipPlanes(near: number, far: number) {
    this.perspectiveNear = near;
    this.perspectiveFar = far;
    this.dirty = true;
  }
  setPerspectiveFieldOfView(fovInDegrees: number) {
    this.perspectiveFov = glMatrix.toRadian(fovInDegrees);
    this.dirty = true;
  }
  setMode(mode: 'perspective' | 'orthographic') {
    this.mode = mode;
    this.dirty = true;
  }
  setHeight(height: number) {
    this.viewHeight = height;
    this.dirty = true;
  }

  setDistance(distance: number) {
    this.viewDistance = distance;
    this.dirty = true;
  }

  setOrbitAngle(degrees: number) {
    this.viewOrbit = glMatrix.toRadian(degrees);
    this.dirty = true;
  }
  isDirty() {
    return this.dirty;
  }
  info(): CameraInfo {
    return {
      distance: this.viewDistance,
      orbitAngle: this.viewOrbit,
      height: this.viewHeight,
      clipFar: this.perspectiveFar,
      clipNear: this.perspectiveNear,
      fieldOfView: this.perspectiveFov,
      focalPoint: this.focalPointTranslation,
      perspective: this.mode === 'perspective'
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

    {
      let zoomMode = false;
      gl().canvas.addEventListener("mousedown", (e) => {
        zoomMode = true;
      });
      gl().canvas.addEventListener("mouseup", () => {
        zoomMode = false;
      });
      gl().canvas.addEventListener("mousemove", () => {
        if (zoomMode) {
          console.log("move");
        }
      });
    }
  }
}
export const defaultCamera = new Camera();
