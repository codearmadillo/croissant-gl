import './example.element.css';
import {BlazeRenderer} from "../renderer/blaze";
import {DefaultShader} from "./default-shader";
import {Square} from "./square";

export class ExampleElement extends HTMLElement {
  private blaze!: BlazeRenderer;
  private canvas!: HTMLCanvasElement;
  public static observedAttributes = [];
  connectedCallback() {
    this.innerHTML = `
      <canvas id="canvas" width="560" height="560"></canvas>
    `;
    this.canvas = this.querySelector("canvas") as HTMLCanvasElement;
    this.startBlaze();
  }
  private startBlaze() {
    this.blaze = new BlazeRenderer(this.canvas);
    this.blaze.setShader(new DefaultShader());
    this.blaze.addDrawable(new Square());
    // this.blaze.addDrawable(new Cube());
    this.blaze.start();
  }
}
customElements.define('webgl2-example', ExampleElement);
