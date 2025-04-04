// services/transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) {}

  createTransaction(transactionData: any): Observable<any> {
    return this.http.post(this.apiUrl, transactionData);
  }

  getUserTransactions(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/search`, { username });
  }
  
}