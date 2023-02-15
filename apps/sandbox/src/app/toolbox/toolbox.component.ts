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
  private readonly MODEL_SCENE_STORAGE_KEY: string = "ui_scene_storage";
  private readonly UI_MODEL_STORAGE_KEY: string = "ui_model_storage";
  private readonly MODEL_STORAGE_KEY: string = "model_storage";
  private readonly uiModel: UiConfiguration = {
    cameraOpen: true,
    perspectiveOpen: true,
    objectsOpen: true,
    objectsCreateOpen: true,
    objectsListOpen: true,
    sceneOpen: true
  }
  private readonly model: CroissantConfiguration = {
    camera_field_of_view: 45,
    camera_near: 0.1,
    camera_far: 1000,
    camera_focalPoint_x: 0,
    camera_focalPoint_y: 0,
    camera_focalPoint_z: 0,
    camera_perspective: 1,
    camera_distance: 0,
    camera_orbit_angle: 0,
    camera_height: 0,
  }
  private readonly defaultModel: CroissantConfiguration = {
    camera_field_of_view: 45,
    camera_near: 0.1,
    camera_far: 1000,
    camera_focalPoint_x: 0,
    camera_focalPoint_y: 0,
    camera_focalPoint_z: 0,
    camera_perspective: 1,
    camera_distance: 0,
    camera_orbit_angle: 0,
    camera_height: 0,
  }
  scene_xzAxis = true;
  scene_xyAxis = true;
  scene_yzAxis = true;

  @HostBinding("class") get class() {
    return "box-border relative overflow-hidden";
  }

  constructor(public readonly objectService: ObjectService) {
    // Load default values
    const info = croissantGl.camera.info();
    {
      this.defaultModel.camera_field_of_view = info.fieldOfView;
      this.defaultModel.camera_near = info.clipNear;
      this.defaultModel.camera_far = info.clipFar;
      this.defaultModel.camera_focalPoint_x = info.focalPoint[0];
      this.defaultModel.camera_focalPoint_y = info.focalPoint[1];
      this.defaultModel.camera_focalPoint_z = info.focalPoint[2];
      this.defaultModel.camera_perspective = info.perspective ? 1 : 0;
      this.defaultModel.camera_distance = info.distance;
      this.defaultModel.camera_orbit_angle = info.orbitAngle;
      this.defaultModel.camera_height = info.height;
    }
    // Load Model
    const storedModel = localStorage.getItem(this.MODEL_STORAGE_KEY);
    if (storedModel !== null && storedModel !== undefined) {
      this.model = JSON.parse(storedModel as string) as CroissantConfiguration;
      this.loadPresets();
    } else {
      this.model.camera_field_of_view = info.fieldOfView;
      this.model.camera_near = info.clipNear;
      this.model.camera_far = info.clipFar;
      this.model.camera_focalPoint_x = info.focalPoint[0];
      this.model.camera_focalPoint_y = info.focalPoint[1];
      this.model.camera_focalPoint_z = info.focalPoint[2];
      this.model.camera_perspective = info.perspective ? 1 : 0;
      this.model.camera_distance = info.distance;
      this.model.camera_orbit_angle = info.orbitAngle;
      this.model.camera_height = info.height;
    }
    // Load UiModel
    const storedUiModel = localStorage.getItem(this.UI_MODEL_STORAGE_KEY);
    if (storedUiModel !== null && storedUiModel !== undefined) {
      this.uiModel = JSON.parse(storedUiModel as string) as UiConfiguration;
    }
    // Load scene
    const sceneModel = localStorage.getItem(this.MODEL_SCENE_STORAGE_KEY);
    if (sceneModel !== null && sceneModel !== undefined) {
      const sceneModelParsed = JSON.parse(sceneModel) as boolean[];
      this.scene_xzAxis = sceneModelParsed[0];
      this.scene_xyAxis = sceneModelParsed[1];
      this.scene_yzAxis = sceneModelParsed[2];
      this.onSceneAxisUpdate();
    }
  }

  setModel(key: string, value: number) {
    this.model[key as keyof CroissantConfiguration] = value as any;
  }
  getModel(key: string) {
    return this.model[key as keyof CroissantConfiguration];
  }

  modelChanged(key: string) {
    switch (key as keyof CroissantConfiguration) {
      case "camera_distance":
        croissantGl.camera.setDistance(this.model.camera_distance);
        break;
      case "camera_orbit_angle":
        croissantGl.camera.setOrbitAngle(this.model.camera_orbit_angle);
        break;
      case "camera_height":
        croissantGl.camera.setHeight(this.model.camera_height);
        break;
      case "camera_field_of_view":
        croissantGl.camera.setPerspectiveFieldOfView(this.model.camera_field_of_view);
        break;
      case "camera_near":
      case "camera_far":
        croissantGl.camera.setClipPlanes(this.model.camera_near, this.model.camera_far);
        break;
      case "camera_focalPoint_x":
      case "camera_focalPoint_y":
      case "camera_focalPoint_z":
        croissantGl.camera.focalPoint.setTranslation([this.model.camera_focalPoint_x, this.model.camera_focalPoint_y, this.model.camera_focalPoint_z]);
        break;
      case "camera_perspective":
        croissantGl.camera.setMode(this.model.camera_perspective ? 'perspective' : 'orthographic');
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
    this.model.camera_field_of_view = this.defaultModel.camera_field_of_view;
    this.model.camera_near = this.defaultModel.camera_near;
    this.model.camera_far = this.defaultModel.camera_far;
    this.model.camera_focalPoint_x = this.defaultModel.camera_focalPoint_x;
    this.model.camera_focalPoint_y = this.defaultModel.camera_focalPoint_y;
    this.model.camera_focalPoint_z = this.defaultModel.camera_focalPoint_z;
    this.model.camera_perspective = this.defaultModel.camera_perspective;

    this.loadPresets();
  }

  printDebugInformation() {
    console.table(croissantGl.debug.info());
  }

  onSceneAxisUpdate() {
    localStorage.setItem(this.MODEL_SCENE_STORAGE_KEY, JSON.stringify([ this.scene_xzAxis, this.scene_xyAxis, this.scene_yzAxis ]));
    croissantGl.scene.showAxes(this.scene_xzAxis, this.scene_xyAxis, this.scene_yzAxis);
  }

  private loadPresets() {
    croissantGl.camera.focalPoint.setTranslation([this.model.camera_focalPoint_x, this.model.camera_focalPoint_y, this.model.camera_focalPoint_z]);
    croissantGl.camera.setClipPlanes(this.model.camera_near, this.model.camera_far);
    croissantGl.camera.setPerspectiveFieldOfView(this.model.camera_field_of_view);
    croissantGl.camera.setDistance(this.model.camera_distance);
    croissantGl.camera.setOrbitAngle(this.model.camera_orbit_angle);
    croissantGl.camera.setHeight(this.model.camera_height);
  }
}
