import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { UserDataService } from '../../services/userData.service';
import { MappedCartInterface } from '../../models/cart.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit, OnDestroy {
  plus = faPlus;
  minus = faMinus;
  checked = faCheckCircle;
  cartItems: MappedCartInterface;
  isUserLogIn: boolean;
  showModal = false;
  updatedItemData: { quantity: number; productId: { name: string } };
  showNotification = false;
  headerSub: Subscription;
  cartSub: Subscription;
  constructor(private userService: UserDataService, private router: Router) {}
  ngOnInit() {
    this.headerSub = this.userService.userLogInObs.subscribe((result) => {
      this.isUserLogIn = result;
    });
    this.cartSub = this.rerunDataBase().subscribe();
  }
  rerunDataBase() {
    return this.userService.getCart().pipe(
      tap((result: { message: string; cart: MappedCartInterface }) => {
        if (result !== undefined) {
          this.cartItems = result.cart;
        } else {
          return this.router.navigate(['login']);
        }
      }),
      catchError(() => {
        return this.router.navigate(['login']);
      })
    );
  }
  goHomePage() {
    return this.router.navigate(['/']);
  }
  getImageUrl(path) {
    return `http://localhost:3000/${path}`;
  }
  onPlus(productId: string) {
    this.handlingAddDelete(productId, 'add');
  }
  onMinus(productId: string) {
    this.handlingAddDelete(productId, 'remove');
  }
  onCancel() {
    this.showModal = false;
  }
  onDelete() {
    this.showModal = true;
  }
  onRemove(productId: string) {
    this.userService.addToCart(productId, 'delete').subscribe(() => {
      this.rerunDataBase().subscribe();
      this.showModal = false;
    });
  }
  private handlingAddDelete(productId: string, code: string) {
    this.userService
      .addToCart(productId, code)
      .pipe(
        tap(
          (result: {
            message: string;
            updatedItemData: { quantity: number; productId: { name: string } };
          }) => {
            this.updatedItemData = result.updatedItemData;
          }
        ),
        switchMap(() => {
          return this.rerunDataBase();
        })
      )
      .subscribe(() => {
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000);
      });
  }
  ngOnDestroy() {
    this.headerSub.unsubscribe();
    this.cartSub.unsubscribe();
  }
}
