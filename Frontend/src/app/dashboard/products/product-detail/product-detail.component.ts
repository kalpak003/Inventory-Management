import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class ProductDetailComponent implements OnInit {
  isLoading = true;
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) this.loadProduct(id);
  }

  fetchProductDetails(id: string): void {
  const numericId = Number(id);

  if (isNaN(numericId)) {
    console.error('Invalid product ID:', id);
    return;
  }

  this.productService.getProductById(numericId).subscribe({
    next: (data) => {
      console.log('Product Data:', data); // ✅ Debugging API response

      this.product = {
        id: data.id,
        productname: data.productname || 'N/A',
        category: data.category || '',
        producttype: data.producttype || '',
        modelno: data.modelno || '',
        description: data.description || '',
        image: data.image || null,
        unit: data.unit || '',
        price: data.price || '0.00',
        status: data.status || 'unavailable',
        quantity: data.quantity ?? 0
      };

      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching product details', error);
      this.isLoading = false;
    }
  });
}


  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.isLoading = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/dashboard/products']);
  }
}
