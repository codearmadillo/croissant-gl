const key = "STORE_CROISSANT_GL_SAMPLE_CODE";
export function resolveEditorValue() {
  const v = localStorage.getItem(key);
  if (v !== null && v !== undefined && v !== "") {
    return v;
  }
  return `const croissantGl = window.croissantGl;

// You can create new context using 'croissantGl.createContext(canvas)'
const context = window.croissantGlContext;

// Bootstrap
croissantGl.bootstrap(context);
croissantGl.scene.setClearColor(context, [ 240, 240, 240 ]);

croissantGl.camera.setDistance(context, 250);
croissantGl.camera.setOrbitAngle(context, 45);
croissantGl.camera.setHeight(context, 50);

croissantGl.scene.showAxes(context, true, false, false);

croissantGl.object.create(context, {
    type: "cube",
    size: [ 25, 25, 25 ],
    position: [ 0, 0, 0 ],
    rotation: [ 0, 0, 0 ],
    scale: [ 1, 1, 1 ],
    color: [ 1, 1, 1 ]
});`;
}
export function storeEditorValue(value: string) {
  localStorage.setItem(key, value);
}
export function eraseStoredEditorValue() {
  localStorage.removeItem(key);
}
