import {Component, HostBinding} from '@angular/core';
import { Croissant, CroissantDrawables } from "@webgl2/croissant-gl"
@Component({
  selector: 'webgl2-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class ToolboxComponent {
  @HostBinding("class") get class() {
    return "p-3 box-border";
  }
  createSquare() {
    if (Croissant.ready()) {
      Croissant.addDrawable(new CroissantDrawables.Rect([ 50, 50 ]));
    }
  }
}
