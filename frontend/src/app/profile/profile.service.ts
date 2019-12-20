import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  breadcrumbChanged = new Subject<string>();
  birthDateChanged = new Subject<{ day: number; year: number; month: string }>();

  constructor() {}

  changeBreadcrumb(value: string) {
    this.breadcrumbChanged.next(value);
  }

  changeBirthDate(value: { day: number; year: number; month: string }) {
    this.birthDateChanged.next(value);
  }
}
