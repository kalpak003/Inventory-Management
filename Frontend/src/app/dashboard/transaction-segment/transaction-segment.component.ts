import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transaction-segment',
  templateUrl: './transaction-segment.component.html',
  styleUrls: ['./transaction-segment.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule
  ]

})
export class TransactionSegmentComponent implements OnInit {
  transactions: any[] = [];
  username = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName();
    console.log('Current user:', this.username);
  
    if (!this.username) {
      console.error('Username is not set. Please ensure it is stored in localStorage after login.');
      return;
    }
  
    this.http.post<any>('http://localhost:3000/api/transactions/user/search/', { username: this.username })
      .subscribe({
        next: (res) => {
          this.transactions = res.transactions;
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
        }
      });
    }
  

  fetchTransactions(): void {
    this.http.post<any>('http://localhost:3000/api/transactions/user/search/', {
      username: this.username
    }).subscribe({
      next: res => {
        this.transactions = res.transactions;
      },
      error: err => console.error('Error fetching transactions', err)
    });
  }
}
