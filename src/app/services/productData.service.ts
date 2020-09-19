import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  constructor(private http: HttpClient) {}
  submitProduct(formData: FormData) {
    return this.http.post('http://localhost:3000/add-product', formData);
  }
}
