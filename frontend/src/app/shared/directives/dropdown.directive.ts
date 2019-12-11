import {
  Directive,
  HostBinding,
  HostListener,
  ElementRef,
  OnInit,
  Input
} from "@angular/core";

@Directive({
  selector: "[appDropdown]"
})
export class DropdownDirective implements OnInit {
  @HostBinding("class.open") isOpen = false;
  @Input() defaultOpen: boolean;

  @HostListener("document:click", ["$event"]) toggleOpen(e: Event) {
    this.isOpen = this.elRef.nativeElement.contains(e.target) ? true : false;
  }
  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    if (this.defaultOpen) {
      this.isOpen = this.defaultOpen;
    }
  }
}
