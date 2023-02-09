export namespace Vec3 {
  export type Vec3 = [ x: number, y: number, z: number ];
}
export namespace Vec4 {
  export type Vec4 = [ a1: number, a2: number, a3: number, a4: number ];
}
export namespace Mat4 {
  export type Mat4 = [ a1: Vec4.Vec4, a2: Vec4.Vec4, a3: Vec4.Vec4, a4: Vec4.Vec4 ];
  export function identity(): Mat4 {
    return [
      [ 1, 0, 0, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 0, 1 ],
    ];
  }
}
