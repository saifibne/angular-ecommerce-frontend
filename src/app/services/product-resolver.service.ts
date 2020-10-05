import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { ProductInterface } from '../models/product.model';
import { Observable } from 'rxjs';

import { ProductDataService } from './productData.service';

@Injectable({ providedIn: 'root' })
export class ProductResolverService
  implements Resolve<{ message: string; productData: ProductInterface }> {
  constructor(private productService: ProductDataService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<{ message: string; productData: ProductInterface }>
    | Promise<{ message: string; productData: ProductInterface }>
    | { message: string; productData: ProductInterface } {
    const sofaProducts = this.productService.sofaProducts;
    const bedProducts = this.productService.bedProducts;
    const chairProducts = this.productService.chairProducts;
    if (
      sofaProducts.length === 0 &&
      chairProducts.length === 0 &&
      bedProducts.length === 0
    ) {
      const productId = route.params['productId'];
      return this.productService.getProductFromDatabase(productId);
    }
  }
}
