import { FormGroup, FormControl } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-custom-date-input",
  templateUrl: "./custom-date-input.component.html",
  styleUrls: ["./custom-date-input.component.scss"]
})
export class CustomDateInputComponent implements OnInit {
  @Input() controlName: string;
  @Input() placeholder: string;
  @Input() title: string;
  @Input() input: FormControl;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {}
}
