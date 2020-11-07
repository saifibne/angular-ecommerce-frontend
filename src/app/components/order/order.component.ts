import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductDataService } from '../../services/productData.service';
import { OrderModel } from '../../models/order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit, OnDestroy {
  orders: OrderModel[] = [];
  orderSub: Subscription;
  constructor(
    private productService: ProductDataService,
    private router: Router
  ) {}
  ngOnInit() {
    this.orderSub = this.productService
      .getOrders()
      .subscribe((result: { message: string; orders: OrderModel[] }) => {
        if (result) {
          this.orders = result.orders;
        } else {
          return this.router.navigate(['login']);
        }
      });
  }
  getImage(path) {
    return `http://localhost:3000/${path}`;
  }
  onShopNow() {
    return this.router.navigate(['/']);
  }
  ngOnDestroy() {
    this.orderSub.unsubscribe();
  }
}