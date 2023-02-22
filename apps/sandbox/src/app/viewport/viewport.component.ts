import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {croissantGl} from "@webgl2/croissant-gl"
import {ObjectService} from "../services/object.service";

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
    croissantGl.scene.setClearColor([ 12, 16, 21 ]);
    croissantGl.start();

    const size = 25;
    const gap = 16;

    for (let x = -1; x < 2; x++) {
      for (let z = -1; z < 2; z++) {
        for (let y = 0; y < 3; y++) {
          croissantGl.object.create({
            type: "cube",
            size: [ size, size, size ],
            position: [ x * (size + 16), y * (size + gap) + size / 2, z * (size + 16) ],
            rotation: [ 0, 0, 0 ],
            scale: [ 1, 1, 1 ],
            color: [ 0.65, 0.65, 0.65 ]
          })
        }
      }
    }

    croissantGl.object.create({
      type: "plane",
      size: [ 200, 200 ],
      position: [ 0, 0, 0 ],
      rotation: [ 0, 0, 0 ],
      scale: [ 1, 1, 1 ],
      color: [ 0.65, 0.65, 0.65 ]
    });
  }

  onEnabledChanged() {
    if (this.enabled) {
      croissantGl.start();
    } else {
      croissantGl.stop();
    }
  }

}
