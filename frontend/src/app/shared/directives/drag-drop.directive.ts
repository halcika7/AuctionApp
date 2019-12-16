//reference -> https://medium.com/@mariemchabeni/angular-7-drag-and-drop-simple-file-uploadin-in-less-than-5-minutes-d57eb010c0dc

import {
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener
} from "@angular/core";

@Directive({
  selector: "[appDragDrop]"
})
export class DragDropDirective {
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding("style.background-color") background;
  @HostBinding("style.opacity") opacity;

  //Dragover listener
  @HostListener("dragover", ["$event"]) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#9ecbec";
    this.opacity = "0.8";
  }

  //Dragleave listener
  @HostListener("dragleave", ["$event"]) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "";
    this.opacity = "";
  }

  //Drop listener
  @HostListener("drop", ["$event"]) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "";
    this.opacity = "";
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }
}
