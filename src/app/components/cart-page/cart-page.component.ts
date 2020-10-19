import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

import { UserDataService } from '../../services/userData.service';
import { MappedCartInterface } from '../../models/cart.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit, OnDestroy {
  plus = faPlus;
  minus = faMinus;
  cartItems: MappedCartInterface;
  isUserLogIn: boolean;
  showModal = false;
  headerSub: Subscription;
  cartSub: Subscription;
  constructor(private userService: UserDataService, private router: Router) {}
  ngOnInit() {
    this.headerSub = this.userService.userLogInObs.subscribe((result) => {
      this.isUserLogIn = result;
    });
    this.cartSub = this.userService.getCart().subscribe(
      (result: { message: string; cart: MappedCartInterface }) => {
        if (result !== undefined) {
          this.cartItems = result.cart;
        } else {
          return this.router.navigate(['login']);
        }
      },
      () => {
        return this.router.navigate(['/login']);
      }
    );
  }
  goHomePage() {
    return this.router.navigate(['/']);
  }
  getImageUrl(path) {
    return `http://localhost:3000/${path}`;
  }
  onPlus(productId: string) {
    this.userService.addToCart(productId, 'add').subscribe(() => {
      this.ngOnInit();
    });
  }
  onMinus(productId: string) {
    this.userService.addToCart(productId, 'remove').subscribe(() => {
      this.ngOnInit();
    });
  }
  onCancel() {
    this.showModal = false;
  }
  onDelete() {
    this.showModal = true;
  }
  onRemove(productId: string) {
    this.userService.addToCart(productId, 'delete').subscribe(() => {
      this.ngOnInit();
      this.showModal = false;
    });
  }
  ngOnDestroy() {
    this.headerSub.unsubscribe();
    this.cartSub.unsubscribe();
  }
}
