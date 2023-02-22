import {vec3} from "gl-matrix";
import {LightInfo} from "../types/light";
import {gl} from "./context";
import {ShaderProgram} from "../types/graphics";

class Light {
  private dirty = true;
  private translation: vec3 = [ 0, 50, 0 ];
  private color: vec3 = [ 1, 1, 1 ];

  bind(shader: ShaderProgram) {
    gl().uniform3fv(shader.getUniformLocation("u_lightPosition"), this.translation);
    gl().uniform3fv(shader.getUniformLocation("u_lightColor"), this.color);
    this.dirty = false;
  }
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
    this.dirty = true;
  }
  translate(translation: vec3) {
    this.translation[0] += translation[0];
    this.translation[1] += translation[1];
    this.translation[2] += translation[2];
    this.dirty = true;
  }
  isDirty() {
    return this.dirty;
  }
}
export const defaultLight = new Light();
