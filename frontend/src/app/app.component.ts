import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .post('http://localhost:5000/api/auth/register', {
        email: 'halcikiooohja_7@hotmail.com',
        firstName: 'dsfijds',
        lastName: 'asdsad',
        password: '@Volimtejaa7'
      })
      .subscribe(users => {
        console.log(users);
      });
  }
}
