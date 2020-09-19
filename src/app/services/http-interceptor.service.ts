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

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private userDataService: UserDataService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url === 'http://localhost:3000/add-product') {
      return this.userDataService.userData.pipe(
        take(1),
        exhaustMap((user) => {
          const newRequest = req.clone({
            headers: new HttpHeaders({ Authorization: `Bearer ${user.token}` }),
          });
          return next.handle(newRequest);
        }),
        catchError((error) => {
          return throwError('Cant get the token from user object.');
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
