import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ProductInterface } from '../models/product.model';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  sofaProducts: ProductInterface[] = [];
  chairProducts: ProductInterface[] = [];
  bedProducts: ProductInterface[] = [];
  product: ProductInterface;
  productObs = new Subject<ProductInterface>();
  constructor(private http: HttpClient) {}
  submitProduct(formData: FormData) {
    const req = new HttpRequest(
      'POST',
      'http://localhost:3000/add-product',
      formData
    );
    return this.http.request(req);
  }
  categoryData(category: string) {
    return this.http
      .get<{ productsData: ProductInterface[] }>(
        `http://localhost:3000/products/${category}`
      )
      .pipe(
        tap((products) => {
          switch (category) {
            case 'sofa':
              this.sofaProducts = products.productsData;
              break;
            case 'chair':
              this.chairProducts = products.productsData;
              break;
            case 'bed':
              this.bedProducts = products.productsData;
              break;
          }
        })
      );
  }
  getSingleProduct(category, productId) {
    let product: ProductInterface;
    if (category === 'sofa') {
      product = this.sofaProducts.find((product) => {
        return product._id === productId;
      });
    } else if (category === 'chair') {
      product = this.chairProducts.find((product) => {
        return product._id === productId;
      });
    } else if (category === 'bed') {
      product = this.bedProducts.find((product) => {
        return product._id === productId;
      });
    }
    if (product) {
      this.product = product;
      this.productObs.next(product);
    } else {
      this.productObs.next(this.product);
    }
  }
  getProductFromDatabase(productId) {
    return this.http
      .get<{ message: string; productData: ProductInterface }>(
        `http://localhost:3000/product/${productId}`
      )
      .pipe(
        tap((product) => {
          this.product = product.productData;
          console.log('resolver runs');
        })
      );
  }
}
