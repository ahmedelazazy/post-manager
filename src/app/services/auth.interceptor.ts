import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    var token = this.authService.getToken();
    var reqCopy = req.clone({ headers: req.headers.set('authorization', 'bearer ' + token) });
    return next.handle(reqCopy);
  }
}
