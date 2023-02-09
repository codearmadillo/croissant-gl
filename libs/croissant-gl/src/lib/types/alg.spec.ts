import {Vec3, Vec4} from "./alg";

describe("Algebra", () => {
  describe("Vec3f", () => {
    it("should add two vectors", () => {
      // arrange
      const a: Vec3.Vec3 = [ 1, 2, 3 ];
      const b: Vec3.Vec3 = [ 4, 5, 6 ];
      const expected: Vec3.Vec3 = [ 5, 7, 9 ];

      // act
      const actual = Vec3.add(a, b);

      // assert
      expect(actual[0]).toEqual(expected[0]);
      expect(actual[1]).toEqual(expected[1]);
      expect(actual[2]).toEqual(expected[2]);
    });
    it("should subtract two vectors", () => {
      // arrange
      const a: Vec3.Vec3 = [ 1, 2, 3 ];
      const b: Vec3.Vec3 = [ 4, 5, 6 ];
      const expected: Vec3.Vec3 = [ -3, -3, -3 ];

      // act
      const actual = Vec3.subtract(a, b);

      // assert
      expect(actual[0]).toEqual(expected[0]);
      expect(actual[1]).toEqual(expected[1]);
      expect(actual[2]).toEqual(expected[2]);
    });
    it("should multiply vector by scalar", () => {
      // arrange
      const a: Vec3.Vec3 = [ 1, 2, 3 ];
      const b = 2;
      const expected: Vec3.Vec3 = [ 2, 4, 6 ];

      // act
      const actual = Vec3.scalar(a, b);

      // assert
      expect(actual[0]).toEqual(expected[0]);
      expect(actual[1]).toEqual(expected[1]);
      expect(actual[2]).toEqual(expected[2]);
    });
    it("should find dot product", () => {
      // arrange
      const a: Vec3.Vec3 = [ 1, 2, 3 ];
      const b: Vec3.Vec3 = [ 4, 5, 6 ];
      const expected = 32;

      // act
      const actual = Vec3.dot(a, b);

      // assert
      expect(actual).toEqual(expected);
    });
    it("should find cross product", () => {
      // arrange
      const a: Vec3.Vec3 = [ 1, 2, 3 ];
      const b: Vec3.Vec3 = [ 4, 5, 6 ];
      const expected: Vec3.Vec3 = [
        -3, 6, -3
      ];

      // act
      const actual = Vec3.cross(a, b);

      // assert
      expect(actual[0]).toEqual(expected[0]);
      expect(actual[1]).toEqual(expected[1]);
      expect(actual[2]).toEqual(expected[2]);
    });
  });
  describe("Vec4f", () => {
    it("should add two vectors", () => {
      // arrange
      const a: Vec4.Vec4 = [ 1, 2, 3, 4 ];
      const b: Vec4.Vec4 = [ 4, 5, 6, 7 ];
      const expected: Vec4.Vec4 = [ 5, 7, 9, 11 ];

      // act
      const actual = Vec4.add(a, b);

      // assert
      expect(actual[0]).toEqual(expected[0]);
      expect(actual[1]).toEqual(expected[1]);
      expect(actual[2]).toEqual(expected[2]);
      expect(actual[3]).toEqual(expected[3]);
    });
    it("should subtract two vectors", () => {
      // arrange
      const a: Vec4.Vec4 = [ 1, 2, 3, 4 ];
      const b: Vec4.Vec4 = [ 4, 5, 6, 7 ];
      const expected: Vec4.Vec4 = [ -3, -3, -3, -3 ];

      // act
      const actual = Vec4.subtract(a, b);

      // assert
      expect(actual[0]).toEqual(expected[0]);
      expect(actual[1]).toEqual(expected[1]);
      expect(actual[2]).toEqual(expected[2]);
      expect(actual[3]).toEqual(expected[3]);
    });
  });
});
