import { Directive, HostBinding, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdownNoautoclose]'
})
export class DropdownNoautocloseDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen(e: Event) {
    this.isOpen = !this.isOpen;
  }
  constructor(private elRef: ElementRef) {}
}
