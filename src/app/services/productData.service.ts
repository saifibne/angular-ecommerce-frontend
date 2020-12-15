import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
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
    return this.http.post('https://hostmaster.club/add-product', formData);
  }
  slideShowData(category: string) {
    return this.http.get<{ productsData: ProductInterface[] }>(
      `https://hostmaster.club/slideshow/${category}`
    );
  }
  categoryData(category: string, value: string) {
    if (value === 'New Arrivals') {
      return this.http.get<{ productsData: ProductInterface[] }>(
        `https://hostmaster.club/products/${category}`,
        {
          params: new HttpParams().set('sortBy', 'newArrivals'),
        }
      );
    } else if (value === 'Customer Ratings') {
      return this.http.get<{ productsData: ProductInterface[] }>(
        `https://hostmaster.club/products/${category}`,
        {
          params: new HttpParams().set('sortBy', 'ratings'),
        }
      );
    } else if (value === 'Added By Date') {
      return this.http.get<{ productsData: ProductInterface[] }>(
        `https://hostmaster.club/products/${category}`,
        {
          params: new HttpParams().set('sortBy', 'addedDate'),
        }
      );
    }
  }
  getProductFromDatabase(productId) {
    return this.http
      .get<{ message: string; productData: ProductInterface }>(
        `https://hostmaster.club/product/${productId}`
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
        }),
        map((product) => {
          function compare(a, b) {
            if (a.sorting < b.sorting) {
              return -1;
            }
            if (a.sorting > b.sorting) {
              return 1;
            }
            return 0;
          }
          const sortedImageUrls = product.productData.imageUrls.sort(compare);
          return {
            message: product.message,
            productData: { ...product.productData, imageUrls: sortedImageUrls },
          };
        })
      );
  }
  getSearchedProducts(input: string) {
    return this.http.get<{ productsData: ProductInterface[] }>(
      'https://hostmaster.club/search',
      {
        params: new HttpParams().set('search', input),
      }
    );
  }
  postAddCommentsReply(message: string, productId: string, commentId: string) {
    return this.http.post(
      `https://hostmaster.club/product/comment/reply/${productId}`,
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
      `https://hostmaster.club/product/comment/${productId}`,
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
          }>('https://hostmaster.club/admin/products', {
            headers: new HttpHeaders({ Authorization: `Bearer ${user.token}` }),
          });
        } else {
          return of(null);
        }
      })
    );
  }
  deleteProduct(productId: string) {
    return this.http.delete(`https://hostmaster.club/delete/${productId}`);
  }
  getWishlistItems() {
    return this.userService.userData.pipe(
      switchMap((user) => {
        if (user) {
          return this.http.get('https://hostmaster.club/get-wishlist', {
            headers: new HttpHeaders({ Authorization: `Bearer ${user.token}` }),
          });
        } else {
          return of(null);
        }
      }),
      catchError(() => {
        return of(null);
      })
    );
  }
  addWishListItem(productId: string) {
    return this.userService.userData.pipe(
      switchMap((user) => {
        if (user) {
          return this.http.get(
            `https://hostmaster.club/wishlist/${productId}`,
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
  deleteWishListItem(itemId: string) {
    return this.userService.userData.pipe(
      switchMap((user) => {
        if (user) {
          return this.http.delete<{ message: string }>(
            `https://hostmaster.club/wishlist/${itemId}`,
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
    return this.http.post('https://hostmaster.club/order', orderItems);
  }
  getOrders() {
    return this.userService.userData.pipe(
      exhaustMap((user) => {
        if (user) {
          return this.http.get<{ message: string; orders: OrderModel[] }>(
            'https://hostmaster.club/orders',
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
