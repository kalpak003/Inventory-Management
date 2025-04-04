import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  isLoading = true;
  isAdmin = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.isAdmin = this.authService.getCurrentUser()?.role === 'admin';
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
        this.snackBar.open('Error loading products', 'Close', {
          duration: 2000
        });
      }
    });
  }


viewDetails(productId: number) {
  this.router.navigate(['/dashboard/products', productId], { queryParams: { view: true } });
}
  

  addProduct(): void {
    this.router.navigate(['/dashboard/products/add']);
  }

  editProduct(product: any): void {
    this.router.navigate([`/dashboard/products/${product.id}/edit`]);
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this product?'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.snackBar.open('Product deleted successfully!', 'Close', {
              duration: 3000
            });
            this.loadProducts();
          },
          error: (err) => {
            this.snackBar.open('Failed to delete product', 'Close', {
              duration: 3000
            });
            this.isLoading = false;
          }
        });
      }
    });
  }
}
