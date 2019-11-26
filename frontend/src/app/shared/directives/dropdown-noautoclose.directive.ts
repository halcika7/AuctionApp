import { Directive, HostBinding, HostListener, ElementRef, OnInit, Input } from "@angular/core";

@Directive({
  selector: "[appDropdownNoautoclose]"
})
export class DropdownNoautocloseDirective implements OnInit {
  @HostBinding("class.open") isOpen = false;
  @Input() defaultOpen: boolean;

  @HostListener("click", ["$event"]) toggleOpen(e: Event) {
    this.isOpen =
      this.elRef.nativeElement.contains(e.target) && this.elRef.nativeElement !== e.target
        ? true
        : !this.isOpen;
  }
  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    if(this.defaultOpen) {
      this.isOpen = this.defaultOpen;
    }
  }
}
