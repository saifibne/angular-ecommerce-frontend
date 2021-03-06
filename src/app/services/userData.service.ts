import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { User, UserInterface } from '../models/user.model';
import { CartInterface } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  logOutTimer;
  userData = new ReplaySubject<User>(1);
  userLogInObs = new BehaviorSubject<{ login: boolean; name: string }>({
    login: false,
    name: null,
  });
  showHeader = new BehaviorSubject<boolean>(true);
  fixedHeader = new BehaviorSubject<boolean>(false);
  showFooter = new BehaviorSubject<boolean>(true);
  loadProgressBar = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  signUp(name: string, email: string, password: string, companyName: string) {
    return this.http.put('https://hostmaster.club/signin', {
      name: name,
      email: email,
      password: password,
      companyName: companyName,
    });
  }
  logIn(email: string, password: string) {
    return this.http
      .put<UserInterface>('https://hostmaster.club/login', {
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
            this.userLogInObs.next({
              login: true,
              name: userData.userData.name,
            });
            localStorage.setItem('token', user.token);
          }
        })
      );
  }
  logout() {
    localStorage.removeItem('token');
    this.userData.next(null);
    this.userLogInObs.next({ login: false, name: null });
    clearTimeout(this.logOutTimer);
  }
  autoLogin() {
    const token: string = localStorage.getItem('token');
    if (!token) {
      this.userLogInObs.next({ login: false, name: null });
      this.userData.next(null);
      return;
    }
    this.http
      .get<UserInterface>('https://hostmaster.club/userData', {
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
          this.userLogInObs.next({ login: true, name: user.userData.name });
          this.autoLogOut(new Date(user.expireTime));
        },
        (error) => {
          this.logout();
          this.userLogInObs.next({ login: false, name: null });
          this.userData.next(null);
          console.log(error);
        }
      );
  }
  autoLogOut(expireTime: Date) {
    const logOutTime = expireTime.getTime();
    const currentTime = Date.now();
    const timeOut = logOutTime - currentTime;
    this.logOutTimer = setTimeout(() => {
      this.logout();
    }, timeOut);
  }
  getCart() {
    return this.userData.pipe(
      switchMap((user) => {
        if (user) {
          return this.http.get<{ message: string; cart: CartInterface }>(
            'https://hostmaster.club/cart',
            {
              headers: new HttpHeaders({
                Authorization: `Bearer ${user.token}`,
              }),
            }
          );
        } else {
          return of(null);
        }
      }),
      map((result: { message: string; cart: CartInterface }) => {
        if (result !== null) {
          let priceSave: number = 0;
          const newCartItems = result.cart.items.map((item) => {
            const deliveryDate = new Date(
              new Date().setDate(new Date().getDate() + 7)
            );
            const offerPercentage = Math.round(
              ((item.productId.originalPrice - item.productId.offerPrice) /
                item.productId.originalPrice) *
                100
            );
            priceSave +=
              (item.productId.originalPrice - item.productId.offerPrice) *
              item.quantity;
            return {
              ...item,
              deliveryDate: deliveryDate,
              offerPercentage: offerPercentage,
            };
          });
          return {
            message: result.message,
            cart: {
              items: newCartItems,
              totalPrice: result.cart.totalPrice,
              priceSave: priceSave,
            },
          };
        }
      })
    );
  }
  addToCart(productId: string, code: string) {
    return this.http.post(`https://hostmaster.club/cart/${productId}`, {
      code: code,
    });
  }
}
