import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-no-active",
  templateUrl: "./no-active.component.html",
  styleUrls: ["./no-active.component.scss"]
})
export class NoActiveComponent implements OnInit {
  @Output() buttonClicked = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onButtonClicked() {
    this.buttonClicked.emit();
  }
}
