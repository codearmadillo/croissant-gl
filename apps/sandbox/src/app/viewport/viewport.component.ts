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

  constructor(private readonly objectService: ObjectService) {
  }

  ngAfterViewInit() {
    croissantGl.bootstrap(this.canvasElement);
    croissantGl.start();

    /*
    const cube = croissantGl.object.create({
      type: "cube",
      size: [ 32, 32, 32 ],
      position: [ 0, -16, 0 ],
      rotation: [ 0, 0, 0, ],
      scale: [ 1, 1, 1 ]
    });
    this.objectService.add(cube);
    // start interval
    setInterval(() => {
      // croissantGl.object.rotate(cube, [ 0, 0.5, 0 ]);
    }, 1000 / 60);
     */
  }

  onEnabledChanged() {
    if (this.enabled) {
      croissantGl.start();
    } else {
      croissantGl.stop();
    }
  }

}
