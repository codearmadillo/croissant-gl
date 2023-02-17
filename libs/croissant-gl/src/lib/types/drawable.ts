export interface Drawable {
  readonly enabled: boolean;
  draw(): void;
  enable(): void;
  disable(): void;
}
