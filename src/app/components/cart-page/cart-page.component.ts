import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

import { UserDataService } from '../../services/userData.service';
import { MappedCartInterface } from '../../models/cart.model';
import { ProductDataService } from '../../services/productData.service';

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
  showModal = false;
  productId: string;
  updatedItemData: { quantity: number; productId: { name: string } };
  showNotification = false;
  cartSub: Subscription;
  constructor(
    private userService: UserDataService,
    private productService: ProductDataService,
    private router: Router
  ) {}
  ngOnInit() {
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
    this.productId = null;
  }
  onDelete(productId: string) {
    this.showModal = true;
    this.productId = productId;
  }
  onRemove() {
    if (this.productId) {
      this.userService
        .addToCart(this.productId, 'delete')
        .pipe(
          switchMap(() => {
            return this.rerunDataBase();
          })
        )
        .subscribe(() => {
          this.onCancel();
        });
    }
  }
  onOrder() {
    const orderItems = [...this.cartItems.items];
    const mappedOrderItems = orderItems.map((item) => {
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.offerPrice,
        imageUrl: item.productId.imageUrls[0].path,
        deliveryDate: item.deliveryDate,
        seller: item.seller,
        quantity: item.quantity,
      };
    });
    this.productService
      .postOrder(mappedOrderItems)
      .pipe(take(1))
      .subscribe(() => {
        return this.router.navigate(['order']);
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
    this.cartSub.unsubscribe();
  }
}
