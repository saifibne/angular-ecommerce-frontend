import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, take } from 'rxjs/operators';

import { UserDataService } from './userData.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private userDataService: UserDataService,
    private router: Router
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method === 'POST') {
      return this.userDataService.userData.pipe(
        take(1),
        exhaustMap((user) => {
          console.log(user);
          const newRequest = req.clone({
            headers: new HttpHeaders({
              Authorization: `Bearer ${user.token}`,
            }),
          });
          return next.handle(newRequest);
        }),
        catchError((error) => {
          this.router.navigate(['/login']);
          return throwError('Cant get the token from user object.');
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
