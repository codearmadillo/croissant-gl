import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ObjectService {
    private objects: number[] = [];
    private $objects: Subject<number[]> = new Subject<number[]>();
    objects$ = this.$objects.asObservable();
    add(entity: number) {
        this.objects.push(entity);
        this.$objects.next(this.objects);
    }
    remove(entity: number): void {
        this.objects = this.objects.filter((o) => o !== entity);
        this.$objects.next(this.objects);
    }
}