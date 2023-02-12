import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {croissantGl, croissantDrawables} from "@webgl2/croissant-gl"
@Component({
  selector: 'webgl2-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements AfterViewInit {

  enabled = true;

  @ViewChild("mainCanvas")
  private readonly canvasElementRef: ElementRef;
  private get canvasElement() {
    return this.canvasElementRef?.nativeElement as HTMLCanvasElement;
  }

  ngAfterViewInit() {
    croissantGl.bootstrap(this.canvasElement);
    croissantGl.start();
    croissantGl.create(new croissantDrawables.Cube([ 25, 25, 25 ]));
    // croissantGl.create(new croissantDrawables.Rect([50, 50]));
  }

  onEnabledChanged() {
    if (this.enabled) {
      croissantGl.start();
    } else {
      croissantGl.stop();
    }
  }

}
