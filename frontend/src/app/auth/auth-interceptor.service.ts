import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('accessToken')
      ? localStorage.getItem('accessToken')
      : sessionStorage.getItem('accessToken');
    const modifiedReq = req.clone({
      url: environment.apiUrl + req.url,
      headers: req.headers.set('Authorization', 'Bearer ' + token),
      withCredentials: true
    });
    return next.handle(modifiedReq);
  }
}
