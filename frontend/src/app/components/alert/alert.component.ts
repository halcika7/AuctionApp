import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"]
})
export class AlertComponent implements OnInit {
  @Output() closeAlert = new EventEmitter<any>();
  @Input() type: boolean;
  @Input() gold: boolean;
  @Input() message: string;
  @Input() closable = true;

  constructor() {}

  ngOnInit() {}

  onCloseAlert() {
    this.closeAlert.emit();
  }
}
