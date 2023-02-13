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

    const cube = croissantGl.create.cube([ 0, 0, 0 ], [ 25, 25, 25 ]);
    this.objectService.add(cube);
  }

  onEnabledChanged() {
    if (this.enabled) {
      croissantGl.start();
    } else {
      croissantGl.stop();
    }
  }

}
