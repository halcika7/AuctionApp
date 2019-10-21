import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Output() closeAlert = new EventEmitter<any>();
  @Input() type: boolean;
  @Input() message: string;

  constructor() {}

  ngOnInit() {}

  onCloseAlert() {
    this.closeAlert.emit();
  }
}
