import {Component, HostBinding, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {AngularSvgIconModule} from "angular-svg-icon";

@Component({
  selector: 'webgl2-foldable-section',
  templateUrl: './foldable-section.component.html',
  styleUrls: ['./foldable-section.component.scss'],
  imports: [
    NgClass,
    AngularSvgIconModule
  ],
  standalone: true
})
export class FoldableSectionComponent {

  @HostBinding("class") get class() {
    return 'block overflow-hidden rounded-md border border-slate-200';
  }

  @Input() title: string;
  @Input() open: boolean;

}
