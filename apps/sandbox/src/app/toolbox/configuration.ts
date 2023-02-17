export interface CroissantConfiguration {
  camera_distance: number;
  camera_orbit_angle: number;
  camera_height: number;
  camera_field_of_view: number;
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
  lightOpen: boolean;
}
