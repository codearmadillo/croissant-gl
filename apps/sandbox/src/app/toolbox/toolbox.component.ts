import {Component, HostBinding} from '@angular/core';
import { croissantGl } from "@webgl2/croissant-gl"
import { CroissantConfiguration, UiConfiguration} from "./configuration";
import {ObjectService} from "../services/object.service";

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
  private readonly defaultModel: CroissantConfiguration = {
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
    return "box-border relative";
  }

  constructor(public readonly objectService: ObjectService) {
    // Load default values
    const info = croissantGl.camera.info();
    {
      this.defaultModel.camera_position_x = info.translation[0];
      this.defaultModel.camera_position_y = info.translation[1];
      this.defaultModel.camera_position_z = info.translation[2];
      this.defaultModel.camera_rotation_x = info.rotation[0];
      this.defaultModel.camera_rotation_y = info.rotation[1];
      this.defaultModel.camera_rotation_z = info.rotation[2];
      this.defaultModel.camera_angle = info.angle;
      this.defaultModel.camera_near = info.clipNear;
      this.defaultModel.camera_far = info.clipFar;
    }
    // Load Model
    const storedModel = localStorage.getItem(this.MODEL_STORAGE_KEY);
    if (storedModel !== null && storedModel !== undefined) {
      this.model = JSON.parse(storedModel as string) as CroissantConfiguration;
      this.loadPresets();
    } else {
      this.model.camera_position_x = info.translation[0];
      this.model.camera_position_y = info.translation[1];
      this.model.camera_position_z = info.translation[2];
      this.model.camera_rotation_x = info.rotation[0];
      this.model.camera_rotation_y = info.rotation[1];
      this.model.camera_rotation_z = info.rotation[2];
      this.model.camera_angle = info.angle;
      this.model.camera_near = info.clipNear;
      this.model.camera_far = info.clipFar;
    }
    // Load UiModel
    const storedUiModel = localStorage.getItem(this.UI_MODEL_STORAGE_KEY);
    if (storedUiModel !== null && storedUiModel !== undefined) {
      this.uiModel = JSON.parse(storedUiModel as string) as UiConfiguration;
    }
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
      case "camera_rotation_y":
      case "camera_rotation_z":
        croissantGl.camera.rotate(this.model.camera_rotation_x, this.model.camera_rotation_z, this.model.camera_rotation_z);
        break;
      case "camera_angle":
      case "camera_near":
      case "camera_far":
        croissantGl.camera.perspective(this.model.camera_angle, this.model.camera_near, this.model.camera_far);
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

  getObjectId(object: number) {
    return croissantGl.object.info(object)?.id;
  }

  resetCameraToDefault() {
    this.model.camera_position_x = this.defaultModel.camera_position_x;
    this.model.camera_position_y = this.defaultModel.camera_position_y;
    this.model.camera_position_z = this.defaultModel.camera_position_z;
    this.model.camera_rotation_x = this.defaultModel.camera_rotation_x;
    this.model.camera_rotation_y = this.defaultModel.camera_rotation_y;
    this.model.camera_rotation_z = this.defaultModel.camera_rotation_z;
    this.model.camera_angle = this.defaultModel.camera_angle;
    this.model.camera_near = this.defaultModel.camera_near;
    this.model.camera_far = this.defaultModel.camera_far;

    this.loadPresets();
  }

  private loadPresets() {
    croissantGl.camera.rotate(this.model.camera_rotation_x, this.model.camera_rotation_y, this.model.camera_rotation_z);
    croissantGl.camera.translate(this.model.camera_position_x, this.model.camera_position_y, this.model.camera_position_z);
    croissantGl.camera.perspective(this.model.camera_angle, this.model.camera_near, this.model.camera_far);
  }
}
