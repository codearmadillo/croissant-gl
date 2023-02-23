import {AfterViewChecked, AfterViewInit, Component, HostBinding} from '@angular/core';
import {croissantGl} from "@webgl2/croissant-gl"
import {CodeModel} from "@ngstack/code-editor";
import {eraseStoredEditorValue, resolveEditorValue, storeEditorValue} from "./default-code";

@Component({
  selector: 'webgl2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  theme = "vs";
  codeModel: CodeModel = {
    language: "javascript",
    value: resolveEditorValue(),
    uri: "main.js"
  };
  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  }

  @HostBinding("class") get class() {
    return `flex items-center justify-center bg-site w-full h-full`;
  }

  ngAfterViewInit() {
    this.onCodeRun();
  }

  onCodeRun() {
    (window as any).croissantGl = croissantGl;
    eval(this.codeModel.value);
  }

  onCodeChanged(value: string) {
    storeEditorValue(value);
  }

  onCodeErase() {
    eraseStoredEditorValue();
    location.reload();
  }

}
