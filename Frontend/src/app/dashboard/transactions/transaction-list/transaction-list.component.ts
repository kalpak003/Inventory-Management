// transactions/transaction-list/transaction-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})

export class TransactionListComponent implements OnInit {
  products: any[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
      }
    });
  }

  selectProduct(product: any): void {
    this.router.navigate(['/dashboard/transactions/form'], {
      state: { product }
    });
  }
}