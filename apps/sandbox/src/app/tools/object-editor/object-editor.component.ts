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
  @Input() croissantObject: any;

  enabled: boolean;
  rotation_x: number;
  rotation_y: number;
  rotation_z: number;
  position_x: number;
  position_y: number;
  position_z: number;

  ngOnInit() {
    this.enabled = this.croissantObject.enabled;
    this.rotation_x = this.croissantObject.rotation[0];
    this.rotation_y = this.croissantObject.rotation[1];
    this.rotation_z = this.croissantObject.rotation[2];
    this.position_x = this.croissantObject.translation[0];
    this.position_y = this.croissantObject.translation[1];
    this.position_z = this.croissantObject.translation[0];
  }

  onChangeObjectVisibility() {
    if (this.enabled) {
      this.croissantObject.enable();
    } else {
      this.croissantObject.disable();
    }
  }

  onModelChanged(type: 'rotation' | 'position') {
    if (type === "rotation") {
      this.croissantObject.rotate([ this.rotation_x, this.rotation_y, this.rotation_z ]);
    } else {
      this.croissantObject.translate([ this.position_x, this.position_y, this.position_z ]);
    }
  }
}
