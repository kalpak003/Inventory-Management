import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule
  ]
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log('ProductFormComponent initialized');
  
    this.productForm = this.fb.group({
      productname: ['', Validators.required],
      category: ['', Validators.required],
      producttype: [''],
      modelno: [''],
      description: [''],
      image: [''],
      unit: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      status: ['available', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]]
    });
  
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('Route ID:', id);
  
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProductData(this.productId);
      }
    });
  }
  

  loadProductData(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        console.log('Loaded product:', product); // ✅ For debugging
        this.productForm.patchValue({
          productname: product.productname ?? '',
          category: product.category ?? '',
          producttype: product.producttype ?? '',
          modelno: product.modelno ?? '',
          description: product.description ?? '',
          image: product.image ?? '',
          unit: product.unit ?? '',
          price: product.price ?? '',
          status: product.status ?? 'available',
          quantity: product.quantity ?? 0
        });
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.snackBar.open('Failed to load product details', 'Close', { duration: 3000 });
      }
    });
  }
  

  onSubmit() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => this.showSuccess('Product updated successfully!'),
        error: (err) => {
          console.error('Error updating product:', err);
          this.snackBar.open('Failed to update product', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: () => this.showSuccess('Product added successfully!'),
        error: (err) => {
          console.error('Error adding product:', err);
          this.snackBar.open('Failed to add product', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/products']);
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['/dashboard/products']);
  }
}
