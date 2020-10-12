import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User, UserInterface } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  userData = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient) {}

  signUp(name: string, email: string, password: string, companyName: string) {
    return this.http.put('http://localhost:3000/signin', {
      name: name,
      email: email,
      password: password,
      companyName: companyName,
    });
  }
  logIn(email: string, password: string) {
    return this.http
      .put<UserInterface>('http://localhost:3000/login', {
        email: email,
        password: password,
      })
      .pipe(
        tap((userData) => {
          if (userData.token) {
            const expireTime = new Date(userData.expireTime);
            const user = new User(
              userData.userData,
              userData.token,
              expireTime
            );
            this.userData.next(user);
            localStorage.setItem('token', user.token);
          }
        })
      );
  }
  logout() {
    localStorage.removeItem('token');
  }
  autoLogin() {
    const token: string = localStorage.getItem('token');
    if (!token) {
      return;
    }
    this.http
      .get<UserInterface>('http://localhost:3000/userData', {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .subscribe(
        (user) => {
          const existingUser = new User(
            user.userData,
            user.token,
            new Date(user.expireTime)
          );
          this.userData.next(existingUser);
        },
        (error) => {
          this.logout();
          console.log(error);
        }
      );
  }
}
