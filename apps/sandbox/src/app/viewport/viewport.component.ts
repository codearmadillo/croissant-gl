import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Croissant, CroissantDrawables} from "@webgl2/croissant-gl"
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
    Croissant.bootstrap(this.canvasElement);
    Croissant.start();
    Croissant.addDrawable(new CroissantDrawables.Rect([ 50, 50 ]));
  }

  onEnabledChanged() {
    if (this.enabled) {
      Croissant.start();
    } else {
      Croissant.stop();
    }
  }

}
