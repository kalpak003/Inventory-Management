// products/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,MatIconModule]
})
export class ProductDetailComponent implements OnInit {
  product: any;
  isLoading = true;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.isLoading = false;
      }
    });
  }

  editProduct(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}