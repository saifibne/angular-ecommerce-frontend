import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

import {
  mappedProductInterface,
  ProductInterface,
} from '../models/product.model';
import { UserDataService } from './userData.service';
import { OrderModel } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  product: mappedProductInterface;
  hideSearchBoxObs = new Subject<[]>();
  constructor(private http: HttpClient, private userService: UserDataService) {}
  submitProduct(formData: FormData) {
    const req = new HttpRequest(
      'POST',
      'http://localhost:3000/add-product',
      formData
    );
    return this.http.request(req);
  }
  slideShowData(category: string) {
    return this.http.get<{ productsData: ProductInterface[] }>(
      `http://localhost:3000/slideshow/${category}`
    );
  }
  categoryData(category: string, value: string) {
    if (value === 'New Arrivals') {
      return this.http.get<{ productsData: ProductInterface[] }>(
        `http://localhost:3000/products/${category}`,
        {
          params: new HttpParams().set('sortBy', 'newArrivals'),
        }
      );
    } else if (value === 'Customer Ratings') {
      return this.http.get<{ productsData: ProductInterface[] }>(
        `http://localhost:3000/products/${category}`,
        {
          params: new HttpParams().set('sortBy', 'ratings'),
        }
      );
    } else if (value === 'Added By Date') {
      return this.http.get<{ productsData: ProductInterface[] }>(
        `http://localhost:3000/products/${category}`,
        {
          params: new HttpParams().set('sortBy', 'addedDate'),
        }
      );
    }
  }
  getProductFromDatabase(productId) {
    return this.http
      .get<{ message: string; productData: ProductInterface }>(
        `http://localhost:3000/product/${productId}`
      )
      .pipe(
        map((product) => {
          const priceDifference =
            product.productData.originalPrice - product.productData.offerPrice;
          const offerPercentage = Math.round(
            (priceDifference / product.productData.originalPrice) * 100
          );
          const deliveryDate = new Date(
            new Date().setDate(new Date().getDate() + 7)
          );
          return {
            message: product.message,
            productData: {
              ...product.productData,
              priceDifference: priceDifference,
              offerPercentage: offerPercentage,
              deliveryDate: deliveryDate,
            },
          };
        })
      );
  }
  getSearchedProducts(input: string) {
    return this.http.get<{ productsData: ProductInterface[] }>(
      'http://localhost:3000/search',
      {
        params: new HttpParams().set('search', input),
      }
    );
  }
  postAddCommentsReply(message: string, productId: string, commentId: string) {
    return this.http.post(
      `http://localhost:3000/product/comment/reply/${productId}`,
      { comment: message },
      {
        params: new HttpParams().set('commentId', commentId),
      }
    );
  }
  postAddComment(
    productId: string,
    title: string,
    comment: string,
    rating: number
  ) {
    return this.http.post(
      `http://localhost:3000/product/comment/${productId}`,
      {
        title: title,
        comment: comment,
        rating: rating,
      }
    );
  }
  getAdminProducts() {
    return this.userService.userData.pipe(
      switchMap((user) => {
        if (user) {
          return this.http.get<{
            message: string;
            products: ProductInterface[];
          }>('http://localhost:3000/admin/products', {
            headers: new HttpHeaders({ Authorization: `Bearer ${user.token}` }),
          });
        } else {
          return of(null);
        }
      })
    );
  }
  deleteProduct(productId: string) {
    return this.http.delete(`http://localhost:3000/delete/${productId}`);
  }
  getWishlistItems() {
    return this.userService.userData.pipe(
      switchMap((user) => {
        if (user) {
          return this.http.get('http://localhost:3000/get-wishlist', {
            headers: new HttpHeaders({ Authorization: `Bearer ${user.token}` }),
          });
        } else {
          return of(null);
        }
      })
    );
  }
  addWishListItem(productId: string) {
    return this.userService.userData.pipe(
      switchMap((user) => {
        if (user) {
          return this.http.get(`http://localhost:3000/wishlist/${productId}`, {
            headers: new HttpHeaders({ Authorization: `Bearer ${user.token}` }),
          });
        } else {
          return of(null);
        }
      })
    );
  }
  deleteWishListItem(itemId: string) {
    return this.userService.userData.pipe(
      switchMap((user) => {
        if (user) {
          return this.http.delete<{ message: string }>(
            `http://localhost:3000/wishlist/${itemId}`,
            {
              headers: new HttpHeaders({
                Authorization: `Bearer ${user.token}`,
              }),
            }
          );
        } else {
          return of(null);
        }
      })
    );
  }
  postOrder(orderItems: any[]) {
    return this.http.post('http://localhost:3000/order', orderItems);
  }
  getOrders() {
    return this.userService.userData.pipe(
      exhaustMap((user) => {
        if (user) {
          return this.http.get<{ message: string; orders: OrderModel[] }>(
            'http://localhost:3000/orders',
            {
              headers: new HttpHeaders({
                Authorization: `Bearer ${user.token}`,
              }),
            }
          );
        } else {
          return of(null);
        }
      })
    );
  }
  mappingProducts(products) {
    return products.map((product) => {
      const priceDifference = product.originalPrice - product.offerPrice;
      const offerPercentage = Math.round(
        (priceDifference / product.originalPrice) * 100
      );
      const deliveryDate = new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toDateString();
      return {
        ...product,
        priceDifference: priceDifference,
        offerPercentage: offerPercentage,
        deliveryDate: deliveryDate,
      };
    });
  }
}
