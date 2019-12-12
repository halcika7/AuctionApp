import { FormGroup, FormControl } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"]
})
export class InputComponent implements OnInit {
  @Input() id: string;
  @Input() type: string;
  @Input() controlName: string;
  @Input() placeholder: string;
  @Input() parentForm: FormGroup;
  @Input() input: FormControl;
  @Input() title: string;
  @Input() pattern: string;
  @Input() showErrors: boolean;
  @Input() autocomplete: string = '';

  constructor() {}

  ngOnInit() {}
}
