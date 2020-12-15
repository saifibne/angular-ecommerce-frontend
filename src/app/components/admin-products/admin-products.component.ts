import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

import { UserDataService } from '../../services/userData.service';
import { ProductDataService } from '../../services/productData.service';
import { ProductInterface } from '../../models/product.model';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: [
    '../cart-page/cart-page.component.css',
    './admin-products.component.css',
  ],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  productSub: Subscription;
  showModal = false;
  searchText: string;
  productId: string;
  adminProducts: ProductInterface[];
  constructor(
    private userService: UserDataService,
    private productService: ProductDataService,
    private router: Router
  ) {}
  ngOnInit() {
    this.userService.loadProgressBar.next(true);
    this.userService.showFooter.next(false);
    this.productSub = this.rerunDataBase().subscribe(() => {
      this.userService.loadProgressBar.next(false);
      this.userService.showFooter.next(true);
    });
  }
  rerunDataBase() {
    return this.productService.getAdminProducts().pipe(
      tap((result: { message: string; products: ProductInterface[] }) => {
        if (result) {
          this.adminProducts = result.products;
        } else {
          return this.router.navigate(['/account/login']);
        }
      })
    );
  }
  onDelete(productId: string) {
    this.showModal = true;
    this.productId = productId;
  }
  onCancel() {
    this.showModal = false;
    this.productId = null;
  }
  onRemove() {
    if (this.productId) {
      this.productService
        .deleteProduct(this.productId)
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
  ngOnDestroy() {
    this.productSub.unsubscribe();
  }
}
