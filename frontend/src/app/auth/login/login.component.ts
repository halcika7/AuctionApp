import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  autoComplete = false;
  loginForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      remember: new FormControl(null)
    });

    this.loginForm.get('remember').valueChanges.subscribe(value => {
      this.autoComplete = value;
    });
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.loginForm);
  }
}
