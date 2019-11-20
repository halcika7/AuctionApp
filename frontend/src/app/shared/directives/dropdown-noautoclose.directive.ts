import { Directive, HostBinding, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[appDropdownNoautoclose]"
})
export class DropdownNoautocloseDirective {
  @HostBinding("class.open") isOpen = false;

  @HostListener("click", ["$event"]) toggleOpen(e: Event) {
    this.isOpen =
      this.elRef.nativeElement.contains(e.target) && this.elRef.nativeElement !== e.target
        ? true
        : !this.isOpen;
  }
  constructor(private elRef: ElementRef) {}
}
