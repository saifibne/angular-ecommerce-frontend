import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDataService } from '../../services/userData.service';
import { ProductDataService } from '../../services/productData.service';
import { ProductInterface } from '../../models/product.model';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: [
    '../cart-page/cart-page.component.css',
    './admin-products.component.css',
  ],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  headerSub: Subscription;
  productSub: Subscription;
  isUserLogIn: boolean;
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
    this.headerSub = this.userService.userLogInObs.subscribe((result) => {
      this.isUserLogIn = result;
    });
    this.productSub = this.rerunDataBase().subscribe();
  }
  rerunDataBase() {
    return this.productService.getAdminProducts().pipe(
      tap((result: { message: string; products: ProductInterface[] }) => {
        if (result) {
          this.adminProducts = result.products;
        } else {
          return this.router.navigate(['login']);
        }
      })
    );
  }
  getImage(path) {
    return `http://localhost:3000/${path}`;
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
    this.headerSub.unsubscribe();
    this.productSub.unsubscribe();
  }
}
