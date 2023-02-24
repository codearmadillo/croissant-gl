import {EventBroker} from "./brokers/event-broker";
import {ObjectBroker} from "./brokers/object-broker";
import {ObjectPropertiesBroker} from "./brokers/object-properties-broker";
import {ShaderBroker} from "./brokers/shader-broker";
import {TextureBroker} from "./brokers/texture-broker";
import {Renderer} from "./renderer";

export class CroissantGlContext {
  public readonly eventBroker: EventBroker;
  public readonly objectBroker: ObjectBroker;
  public readonly objectPropertiesBroker: ObjectPropertiesBroker;
  public readonly shaderBroker: ShaderBroker;
  public readonly textureBroker: TextureBroker;
  public readonly renderer: Renderer;
  private canvas: HTMLCanvasElement;
  private webGl2RenderingContext: WebGL2RenderingContext;
  private bootstrapped = false;
  public get ready() {
    return this.bootstrapped;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.webGl2RenderingContext = this.canvas?.getContext("webgl2") as WebGL2RenderingContext;
    this.eventBroker = new EventBroker();
    this.objectBroker = new ObjectBroker();
    this.objectPropertiesBroker = new ObjectPropertiesBroker();
    this.shaderBroker = new ShaderBroker(this.webGl2RenderingContext);
    this.textureBroker = new TextureBroker(this.webGl2RenderingContext);
    this.renderer = new Renderer(this.webGl2RenderingContext, this.objectBroker, this.objectPropertiesBroker, this.shaderBroker, this.textureBroker);
  }

  bootstrap() {
    if (this.bootstrapped) {
      return;
    }
    this.shaderBroker.bootstrap();
    this.renderer.bootstrap();
    this.renderer.loop();
    this.bootstrapped = true;
  }
}
