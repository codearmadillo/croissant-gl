import {vec3} from "gl-matrix";
import {LightInfo} from "../types/light";

export class Light {
  private dirty = true;
  private translation: vec3 = [ 0, 50, 0 ];
  private color: vec3 = [ 1, 1, 1 ];

  info(): LightInfo {
    return {
      color: [ this.color[0] * 255, this.color[1] * 255, this.color[2] * 255 ],
      translation: this.translation
    }
  }
  setColor(rgb: vec3) {
    this.color = [ rgb[0] / 255, rgb[1] / 255, rgb[2] / 255 ];
    this.dirty = true;
  }
  setTranslation(translation: vec3) {
    this.translation = translation;
    this.markAsDirty();
  }
  translate(translation: vec3) {
    this.translation[0] += translation[0];
    this.translation[1] += translation[1];
    this.translation[2] += translation[2];
    this.markAsDirty();
  }
  isDirty() {
    return this.dirty;
  }
  getColor() {
    return this.color;
  }
  getPosition() {
    return this.translation;
  }
  private markAsDirty() {
    this.dirty = true;
  }
  markAsPristine() {
    this.dirty = false;
  }
}
