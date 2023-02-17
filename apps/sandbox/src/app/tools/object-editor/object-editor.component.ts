import {Component, Input, OnInit} from '@angular/core';
import { croissantGl } from '@webgl2/croissant-gl';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RangeInputComponent} from "../../ui/range-input/range-input.component";

@Component({
  selector: 'webgl2-object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.scss'],
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, RangeInputComponent
  ]
})
export class ObjectEditorComponent implements OnInit {
  @Input() object: number;

  id: number;
  type: string | null;
  enabled: boolean;
  rotation_x: number | null;
  rotation_y: number | null;
  rotation_z: number | null;
  translation_x: number | null;
  translation_y: number | null;
  translation_z: number | null;
  scale_x: number | null;
  scale_y: number | null;
  scale_z: number | null;

  ngOnInit() {
    const info = croissantGl.object.info(this.object);
    if (info !== null) {
      this.id = info.id;
      this.type = info.type;
      this.enabled = info.enabled;
      if (info.rotation !== null) {
        this.rotation_x = info.rotation[0];
        this.rotation_y = info.rotation[1];
        this.rotation_z = info.rotation[2];
      }
      if (info.translation !== null) {
        this.translation_x = info.translation[0];
        this.translation_y = info.translation[1];
        this.translation_z = info.translation[2];
      }
      if (info.scale !== null) {
        this.scale_x = info.scale[0];
        this.scale_y = info.scale[1];
        this.scale_z = info.scale[2];
      }
    }
  }

  rotate() {
    if (this.rotation_x !== null && this.rotation_y !== null && this.rotation_z !== null) {
      croissantGl.object.setRotation(this.object, [ this.rotation_x, this.rotation_y, this.rotation_z ])
    }
  }
  translate() {
    if (this.translation_x !== null && this.translation_y !== null && this.translation_z !== null) {
      croissantGl.object.setTranslation(this.object, [ this.translation_x, this.translation_y, this.translation_z ])
    }
  }
  scale() {
    if (this.scale_x !== null && this.scale_y !== null && this.scale_z !== null) {
      croissantGl.object.setScale(this.object, [ this.scale_x, this.scale_y, this.scale_z ])
    }
  }
  toggle() {
    if (this.enabled) {
      croissantGl.object.enable(this.object);
    } else {
      croissantGl.object.disable(this.object);
    }
  }

}
