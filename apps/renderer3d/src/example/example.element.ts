import './example.element.css';
import { Croissant, CroissantDrawables } from "@webgl2/croissant";

class MySquare extends CroissantDrawables.Square { }

export class ExampleElement extends HTMLElement {
  private canvas!: HTMLCanvasElement;
  public static observedAttributes = [];
  connectedCallback() {
    this.innerHTML = `
      <canvas id="canvas" width="560" height="560"></canvas>
    `;
    this.canvas = this.querySelector("canvas") as HTMLCanvasElement;
    this.bootstrap();
  }
  private bootstrap() {
    Croissant.bootstrap(this.canvas);
    Croissant.addDrawable(new MySquare());
    Croissant.start();
  }
}
customElements.define('webgl2-example', ExampleElement);
