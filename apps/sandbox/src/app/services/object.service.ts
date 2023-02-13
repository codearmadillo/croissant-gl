import {Injectable} from "@angular/core";
import { croissantGl } from "@webgl2/croissant-gl";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ObjectService {
  private objects: croissantGl.CroissantSceneObject[] = [];
  private $objects: Subject<croissantGl.CroissantSceneObject[]> = new Subject<croissantGl.CroissantSceneObject[]>();
  public objects$ = this.$objects.asObservable();
  add(o: croissantGl.CroissantSceneObject) {
    this.objects.push(o);
    this.$objects.next(this.objects);
  }
}
