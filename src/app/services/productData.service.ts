import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { ProductInterface } from '../models/product.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductDataService {
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
    return this.http.get<{ productsData: ProductInterface[] }>(
      `http://localhost:3000/products/${category}`
    );
  }
}
