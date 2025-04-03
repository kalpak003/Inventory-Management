import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ✅ Define Seller interface
export interface Seller {
  id: number;
  companyname: string;
  concernedperson: string;
  address: string;
  contact: string;
  email: string;
  gstno: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'http://localhost:3000/api/sellers';

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

  // ✅ Get all sellers
  getSellers(): Observable<Seller[]> {
    return this.http.get<Seller[]>(this.apiUrl, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  // ✅ Get a single seller by ID
  getSellerById(id: number): Observable<Seller> {
    return this.http.get<Seller>(`${this.apiUrl}/${id}`, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  createSeller(sellerData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, sellerData);
  }


  updateSeller(id: number, sellerData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, sellerData);
  }

  deleteSeller(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
