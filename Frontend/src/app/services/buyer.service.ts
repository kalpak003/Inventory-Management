import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap } from 'rxjs';

interface Buyer {
  id: number;
  company_name: string;
  concernedperson: string;
  address: string;
  contact: string;
  email: string;
  gstno: string;
}

interface UpdateBuyerResponse {
  id: number;
  company_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuyerService {
  private apiUrl = 'http://localhost:3000/api/buyers';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token'); // Ensure the token is retrieved correctly
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

// Get all buyers
  getBuyers(): Observable<Buyer[]> {
    return this.http.get<Buyer[]>(this.apiUrl);
  }

  getBuyerById(id: number): Observable<Buyer> {
    const url = `${this.apiUrl}`.replace(/\/$/, '') + `/${id}`;  // Ensure no double slash
    return this.http.get<Buyer>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    });
  }
  
  
  createBuyer(buyerData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, buyerData, this.getHeaders());
  }

  updateBuyer(id: number, buyerData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}`, buyerData, this.getHeaders());
  }

  deleteBuyer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}`, this.getHeaders());
  }
}
