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
  @Input() autocomplete: string = '';
  @Input() showErrors: boolean;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() profile: boolean = false;
  @Input() isInput: boolean = true;
  @Input() required: boolean = false;

  constructor() {}

  ngOnInit() {}
}
