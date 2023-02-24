const key = "STORE_CROISSANT_GL_SAMPLE_CODE";
export function resolveEditorValue() {
  const v = localStorage.getItem(key);
  if (v !== null && v !== undefined && v !== "") {
    return v;
  }
  return `const croissantGl = window.croissantGl;
const canvas = document.getElementById("mainCanvas");

// Create new rendering context
const context = croissantGl.createContext(canvas);

// Bootstrap
croissantGl.bootstrap(context);
croissantGl.scene.setClearColor(context, [ 240, 240, 240 ]);

// Setup camera
croissantGl.camera.setDistance(context, 250);
croissantGl.camera.setOrbitAngle(context, 45);
croissantGl.camera.setHeight(context, 100);

// Create cube
const cube = croissantGl.object.create(context, {
    type: "plane",
    size: [ 200, 200 ]
});
croissantGl.object.setMaterialColor(context, cube, [ 255, 255, 255 ]);`;
}
export function storeEditorValue(value: string) {
  localStorage.setItem(key, value);
}
export function eraseStoredEditorValue() {
  localStorage.removeItem(key);
}
