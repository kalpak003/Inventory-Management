import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Buyer {
  id: number;
  company_name: string;
  concernedperson: string;
  address: string;
  contact: string;
  email: string;
  gstno: string;
}

interface AddBuyerResponse {
  id: number;
  company_name: string;
}

interface UpdateBuyerResponse {
  id: number;
  company_name: string;
}

interface ErrorResponse {
  message: string;
  error: string;
  statusCode?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BuyerService {
  private apiUrl = 'http://localhost:3000/api/buyers';

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
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client error:', error.error.message);
    } else {
      // Server-side error
      console.error(`Server error: ${error.status}, body:`, error.error);
    }
    return throwError({
      message: 'Something went wrong',
      error: error.error?.message || error.message,
      statusCode: error.status
    });
  }

  // Get all buyers
  getBuyers(): Observable<Buyer[]> {
    return this.http.get<Buyer[]>(this.apiUrl, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  getBuyerById(id: number): Observable<Buyer> {
    return this.http.get<Buyer>(`${this.apiUrl}/${id}`, this.getHeaders())
      .pipe(catchError(this.handleError));
  }
  
  createBuyer(buyerData: Omit<Buyer, 'id'>): Observable<AddBuyerResponse> {
    return this.http.post<AddBuyerResponse>(this.apiUrl, buyerData, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  updateBuyer(id: number, buyerData: Partial<Buyer>): Observable<UpdateBuyerResponse> {
    return this.http.put<UpdateBuyerResponse>(`${this.apiUrl}/${id}`, buyerData, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  deleteBuyer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders())
      .pipe(catchError(this.handleError));
  }
}