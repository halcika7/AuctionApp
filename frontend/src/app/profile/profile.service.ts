import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  breadcrumbChanged = new Subject<string>();

  constructor() {}

  changeBreadcrumb(value: string) {
    this.breadcrumbChanged.next(value);
  }
}
