import {Component, HostBinding, Input, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'webgl2-range-input',
  templateUrl: './range-input.component.html',
  styleUrls: ['./range-input.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass]
})
export class RangeInputComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() fieldName: string;
  @Input() label: string;
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;

  value = 0;

  onChange: any = () => {};
  onTouched: any = () => {};

  @HostBinding("class") get class() {
    return "";
  }

  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: number): void {
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

  onModelChange(e: number) {
    this.value = e;
    this.onChange(e);
  }
}
