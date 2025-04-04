import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  productname: string;
  category: string;
  producttype: string;
  modelno: string;
  description: string;
  image: string | null;
  unit: string;
  price: string;
  status: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Error ${error.status}:`, error.error);
    return throwError(() => new Error(error.error?.message || 'Something went wrong'));
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, this.getHeaders()).pipe(catchError(this.handleError));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, this.getHeaders()).pipe(catchError(this.handleError));
  }

  addProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData, this.getHeaders());
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productData, this.getHeaders());
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
