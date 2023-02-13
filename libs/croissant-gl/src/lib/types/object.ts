import {mat4, quat, ReadonlyVec3, vec3} from "gl-matrix";
import {SceneObject} from "./scene-object";
import {Drawable} from "./drawable";
import {croissantBackend} from "../backend";
import {VertexArrayObject} from "../graphics/vertex-array-object";
import {defaultShader} from "../graphics/shader";
import {gl} from "../graphics/context";

export abstract class BaseSceneObject implements SceneObject, Drawable {
  public get enabled() {
    return this._enabled;
  }
  public get id() {
    return this._id;
  }
  public get translation() {
    return this.modelTranslation;
  }
  public get rotation() {
    return this.modelRotation;
  }
  abstract get type(): string;

  protected vao: VertexArrayObject;
  protected _enabled = true;
  protected readonly _id: number;
  protected readonly modelMatrix: mat4 = mat4.create();
  protected readonly modelRotationQuat: quat = quat.create();
  protected readonly modelRotation: vec3;
  protected readonly modelTranslation: vec3;

  private isRotationDirty = false;
  private isTranslationDirty = false;

  constructor(translation: vec3, rotation: vec3) {
    this._id = croissantBackend.drawables.length;
    this.modelTranslation = translation;
    this.modelRotation = rotation;
  }

  translate(translation: ReadonlyVec3) {
    this.translateX(translation[0]);
    this.translateY(translation[1]);
    this.translateZ(translation[2]);
  }
  translateX(value: number) {
    this.modelTranslation[0] = value;
    this.isTranslationDirty = true;
  }
  translateY(value: number) {
    this.modelTranslation[1] = value;
    this.isTranslationDirty = true;
  }
  translateZ(value: number) {
    this.modelTranslation[2] = value;
    this.isTranslationDirty = true;
  }
  rotate(rotation: ReadonlyVec3) {
    this.rotateX(rotation[0]);
    this.rotateY(rotation[1]);
    this.rotateZ(rotation[2]);
  }
  rotateX(deg: number) {
    this.modelRotation[0] = deg;
    this.isRotationDirty = true;
  }
  rotateY(deg: number) {
    this.modelRotation[1] = deg;
    this.isRotationDirty = true;
  }
  rotateZ(deg: number) {
    this.modelRotation[2] = deg;
    this.isRotationDirty = true;
  }
  scale(scale: ReadonlyVec3) {
    mat4.fromScaling(this.modelMatrix, scale);
  }
  enable(): void {
    this._enabled = true;
  }
  disable(): void {
    this._enabled = false;
  }
  draw() {
    defaultShader.bind();

    if (this.isRotationDirty) {
      this.isRotationDirty = false;
      quat.fromEuler(this.modelRotationQuat, this.modelRotation[0], this.modelRotation[1], this.modelRotation[2]);
    }
    if (this.isTranslationDirty) {
      this.isTranslationDirty = false;
      mat4.fromRotationTranslation(this.modelMatrix, this.modelRotationQuat, this.modelTranslation);
    }

    gl().uniformMatrix4fv(defaultShader.getUniformLocation("u_model"), false, this.modelMatrix);
    this.vao.draw();
  }
}
