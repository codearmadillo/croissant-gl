const key = "STORE_CROISSANT_GL_SAMPLE_CODE";
export function resolveEditorValue() {
  const v = localStorage.getItem(key);
  if (v !== null && v !== undefined && v !== "") {
    return v;
  }
  return `const croissantGl = window.croissantGl;
const canvas = document.getElementById("mainCanvas");

croissantGl.bootstrap(canvas);
croissantGl.scene.setClearColor([ 240, 240, 240 ]);
croissantGl.start();

croissantGl.camera.setDistance(250);
croissantGl.camera.setOrbitAngle(45);
croissantGl.camera.setHeight(50);

croissantGl.scene.showAxes(true, false, false);`;
}
export function storeEditorValue(value: string) {
  localStorage.setItem(key, value);
}
export function eraseStoredEditorValue() {
  localStorage.removeItem(key);
}
