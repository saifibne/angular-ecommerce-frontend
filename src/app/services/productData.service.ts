import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import {
  mappedProductInterface,
  ProductInterface,
} from '../models/product.model';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  sofaProducts: mappedProductInterface[] = [];
  chairProducts: mappedProductInterface[] = [];
  bedProducts: mappedProductInterface[] = [];
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
  categoryData(category: string) {
    return this.http
      .get<{ productsData: ProductInterface[] }>(
        `http://localhost:3000/products/${category}`
      )
      .pipe(
        map((products) => {
          const receivedProducts = products.productsData;
          const newProducts = this.mappingProducts(receivedProducts);
          return { productsData: newProducts };
        }),
        tap((products: { productsData: mappedProductInterface[] }) => {
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
  getProductFromDatabase(productId) {
    return this.http
      .get<{ message: string; productData: ProductInterface }>(
        `http://localhost:3000/product/${productId}`
      )
      .pipe(
        map((product) => {
          const ratingsCount = product.productData.ratings.length;
          const priceDifference =
            product.productData.originalPrice - product.productData.offerPrice;
          const offerPercentage = Math.round(
            (priceDifference / product.productData.originalPrice) * 100
          );
          const deliveryDate = new Date(
            new Date().setDate(new Date().getDate() + 7)
          ).toDateString();
          return {
            message: product.message,
            productData: {
              ...product.productData,
              ratingsCount: ratingsCount,
              priceDifference: priceDifference,
              offerPercentage: offerPercentage,
              deliveryDate: deliveryDate,
            },
          };
        })
      );
  }
  getSearchedProducts(input: string) {
    return this.http.get<{ products: ProductInterface[] }>(
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
  mappingProducts(products) {
    return products.map((product) => {
      const ratingsCount = product.ratings.length;
      const priceDifference = product.originalPrice - product.offerPrice;
      const offerPercentage = Math.round(
        (priceDifference / product.originalPrice) * 100
      );
      const deliveryDate = new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toDateString();
      return {
        ...product,
        ratingsCount: ratingsCount,
        priceDifference: priceDifference,
        offerPercentage: offerPercentage,
        deliveryDate: deliveryDate,
      };
    });
  }
}
