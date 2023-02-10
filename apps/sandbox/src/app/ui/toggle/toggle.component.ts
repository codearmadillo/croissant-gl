import {Component, OnInit, Input, forwardRef, HostBinding} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from "@angular/forms";
import {Optional, Self} from "@angular/core";
import {NgClass} from "@angular/common";

@Component({
  selector: 'webgl2-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [  ],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass]
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() name: string;

  checked = false;

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

  writeValue(value: any): void {
    this.checked = value;
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

  onModelChange(e: boolean) {
    this.checked = e;
    this.onChange(e);
  }
}
