import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { UserDataService } from './userData.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateClass implements CanActivate {
  constructor(
    private userService: UserDataService,
    private http: HttpClient,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userService.userData.pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          return this.router.createUrlTree(['/user/login']);
        }
      })
    );
  }
}
