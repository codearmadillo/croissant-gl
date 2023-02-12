import {Component, Input, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'webgl2-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass]
})
export class SliderComponent implements ControlValueAccessor {
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() disabled = false;

  value: number;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Store the provided function as an internal method.
    this.onTouched = fn;
  }

}
