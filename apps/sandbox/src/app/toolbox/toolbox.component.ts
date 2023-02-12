import {Component, HostBinding} from '@angular/core';
import { croissantGl, croissantDrawables } from "@webgl2/croissant-gl"
import { CroissantConfiguration, UiConfiguration} from "./configuration";

@Component({
  selector: 'webgl2-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class ToolboxComponent {
  private readonly UI_MODEL_STORAGE_KEY: string = "ui_model_storage";
  private readonly MODEL_STORAGE_KEY: string = "model_storage";
  private readonly uiModel: UiConfiguration = {
    cameraOpen: true,
    perspectiveOpen: true,
    objectsOpen: true,
    objectsCreateOpen: true,
    objectsListOpen: true
  }
  private readonly model: CroissantConfiguration = {
    camera_rotation_x: 0,
    camera_rotation_y: 0,
    camera_rotation_z: 0,
    camera_position_x: 0,
    camera_position_y: 0,
    camera_position_z: 0,
    camera_angle: 45,
    camera_near: 0.1,
    camera_far: 1000
  }

  @HostBinding("class") get class() {
    return "p-3 box-border";
  }

  constructor() {
    // Load Model
    const storedModel = localStorage.getItem(this.MODEL_STORAGE_KEY);
    if (storedModel !== null && storedModel !== undefined) {
      this.model = JSON.parse(storedModel as string) as CroissantConfiguration;
    }
    // Load UiModel
    const storedUiModel = localStorage.getItem(this.UI_MODEL_STORAGE_KEY);
    if (storedUiModel !== null && storedUiModel !== undefined) {
      this.uiModel = JSON.parse(storedUiModel as string) as UiConfiguration;
    }
    // Load presets
    this.loadPresets();
  }

  setModel(key: string, value: any) {
    this.model[key as keyof CroissantConfiguration] = value;
  }
  getModel(key: string) {
    return this.model[key as keyof CroissantConfiguration];
  }
  modelChanged(key: string) {
    switch (key as keyof CroissantConfiguration) {
      case "camera_position_x":
      case "camera_position_y":
      case "camera_position_z":
        croissantGl.camera.translate(this.model.camera_position_x, this.model.camera_position_y, this.model.camera_position_z);
        break;
      case "camera_rotation_x":
        croissantGl.camera.rotateX(this.model.camera_rotation_x);
        break;
      case "camera_rotation_y":
        croissantGl.camera.rotateY(this.model.camera_rotation_y);
        break;
      case "camera_rotation_z":
        croissantGl.camera.rotateZ(this.model.camera_rotation_z);
        break;
      case "camera_angle":
        croissantGl.camera.perspective_fov(this.model.camera_angle);
        break;
      case "camera_near":
        croissantGl.camera.perspective_near(this.model.camera_near);
        break;
      case "camera_far":
        croissantGl.camera.perspective_far(this.model.camera_far);
        break;
    }
    localStorage.setItem(this.MODEL_STORAGE_KEY, JSON.stringify(this.model));
  }

  setUiModel(key: string, value: any) {
    this.uiModel[key as keyof UiConfiguration] = value;
  }

  getUiModel(key: string) {
    return this.uiModel[key as keyof UiConfiguration];
  }

  uiModelChanged() {
    localStorage.setItem(this.UI_MODEL_STORAGE_KEY, JSON.stringify(this.uiModel));
  }

  private loadPresets() {
    croissantGl.camera.rotate(this.model.camera_rotation_x, this.model.camera_rotation_y, this.model.camera_rotation_z);
    croissantGl.camera.translate(this.model.camera_position_x, this.model.camera_position_y, this.model.camera_position_z);
    croissantGl.camera.perspective_fov(this.model.camera_angle);
    croissantGl.camera.perspective_near(this.model.camera_near);
    croissantGl.camera.perspective_far(this.model.camera_far);
  }
}
