import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {croissantGl} from "@webgl2/croissant-gl"

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

    const cube = croissantGl.object.create({
      type: "cube",
      size: [ 25, 25, 25 ],
      position: [ 0, 0, 0 ],
      rotation: [ 0, 0, 0, ],
      scale: [ 1, 1, 1 ]
    });
    // start interval
    setInterval(() => {
      croissantGl.object.rotate(cube, [ 0, 0.5, 0 ]);
    }, 1000 / 60);
  }

  onEnabledChanged() {
    if (this.enabled) {
      croissantGl.start();
    } else {
      croissantGl.stop();
    }
  }

}
