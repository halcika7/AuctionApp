import { Directive, HostBinding, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[appDropdown]"
})
export class DropdownDirective {
  @HostBinding("class.open") isOpen = false;

  @HostListener("document:click", ["$event"]) toggleOpen(e: Event) {
    this.isOpen = this.elRef.nativeElement.contains(e.target) ? true : false;
  }
  constructor(private elRef: ElementRef) {}
}
