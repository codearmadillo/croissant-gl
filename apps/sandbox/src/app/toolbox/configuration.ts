export interface CroissantConfiguration {
  camera_rotation_x: number;
  camera_rotation_y: number;
  camera_rotation_z: number;
  camera_position_x: number;
  camera_position_y: number;
  camera_position_z: number;
  camera_angle: number;
  camera_near: number;
  camera_far: number;
  camera_focalPoint_x: number;
  camera_focalPoint_y: number;
  camera_focalPoint_z: number;
  camera_perspective: number;
}

export interface UiConfiguration {
  cameraOpen: boolean;
  perspectiveOpen: boolean;
  objectsOpen: boolean;
  objectsCreateOpen: boolean;
  objectsListOpen: boolean;
  sceneOpen: boolean;
}
