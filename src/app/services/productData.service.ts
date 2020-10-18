import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import {
  mappedProductInterface,
  ProductInterface,
} from '../models/product.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  product: mappedProductInterface;
  hideSearchBoxObs = new Subject<[]>();
  constructor(private http: HttpClient) {}
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
