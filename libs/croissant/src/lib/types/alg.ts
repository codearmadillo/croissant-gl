export namespace Vec3 {
  export type Vec3 = [ x: number, y: number, z: number ];
  export function add(a: Vec3, b: Vec3): Vec3 {
    return [
      a[0] + b[0], a[1] + b[1], a[2] + b[2]
    ]
  }
  export function subtract(a: Vec3, b: Vec3): Vec3 {
    return [
      a[0] - b[0], a[1] - b[1], a[2] - b[2]
    ]
  }
  export function scalar(a: Vec3, s: number): Vec3 {
    return [
      s * a[0], s * a[1], s * a[2]
    ];
  }
  export function dot(a: Vec3, b: Vec3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  export function cross(a: Vec3, b: Vec3): Vec3 {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
}
export namespace Vec4 {
  export type Vec4 = [ a1: number, a2: number, a3: number, a4: number ];
  export function add(a: Vec4, b: Vec4): Vec4 {
    return [
      a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]
    ]
  }
  export function subtract(a: Vec4, b: Vec4): Vec4 {
    return [
      a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]
    ]
  }
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
