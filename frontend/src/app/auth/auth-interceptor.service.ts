import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('accessToken')
      ? localStorage.getItem('accessToken')
      : sessionStorage.getItem('accessToken');
    const url = 'http://localhost:5000/api';
    const modifiedReq = req.clone({
      url: url + req.url,
      headers: req.headers.set('Authorization', 'Bearer ' + token),
      withCredentials: true
    });
    return next.handle(modifiedReq);
  }
}
