import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { environment as dev } from '@env/environment';
import { environment as prod } from '@env/environment.prod';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('accessToken')
      ? localStorage.getItem('accessToken')
      : sessionStorage.getItem('accessToken');
    const modifiedReq = req.clone({
      url: dev.production === false ? dev.apiUrl + req.url : prod.apiUrl + req.url,
      headers: req.headers.set('Authorization', 'Bearer ' + token),
      withCredentials: true
    });
    return next.handle(modifiedReq);
  }
}
