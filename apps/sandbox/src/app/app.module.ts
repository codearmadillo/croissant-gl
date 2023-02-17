import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { ViewportComponent } from './viewport/viewport.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleComponent } from './ui/toggle/toggle.component';
import { FoldableSectionComponent } from './tools/foldable-section/foldable-section.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';
import { HttpClientModule } from '@angular/common/http';
import { RangeInputComponent } from './ui/range-input/range-input.component';
import {ObjectEditorComponent} from "./tools/object-editor/object-editor.component";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    ToolboxComponent,
    ViewportComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleComponent,
    FoldableSectionComponent,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    AngularSvgIconPreloaderModule.forRoot({
      configUrl: '../assets/icons.json',
    }),
    RangeInputComponent,
    ObjectEditorComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
