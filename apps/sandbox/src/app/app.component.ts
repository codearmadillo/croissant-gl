import {Component, HostBinding} from '@angular/core';
@Component({
  selector: 'webgl2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sandbox';
  @HostBinding("class") get class() {
    return `grid grid-cols-[minmax(20%,20rem)_1fr] bg-site w-full h-full`;
  }
}
