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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class ProductFormComponent implements OnInit {
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.isLoading = true;
      this.loadProductData(this.productId);
    }
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      productname: ['', [Validators.required, Validators.maxLength(45)]],
      category: ['', [Validators.required, Validators.maxLength(45)]],
      producttype: ['', [Validators.maxLength(45)]],
      modelno: ['', [Validators.maxLength(45)]],
      description: ['', [Validators.maxLength(200)]],
      image: [null],
      unit: ['', [Validators.maxLength(45)]],
      price: [0, [Validators.required, Validators.min(0)]],  // Changed to number
      status: ['available', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadProductData(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          productname: product.productname,
          category: product.category,
          producttype: product.producttype,
          modelno: product.modelno,
          description: product.description,
          image: product.image,
          unit: product.unit,
          price: parseFloat(product.price) || 0,  // Ensure number
          status: product.status,
          quantity: product.quantity
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.snackBar.open('Failed to load product details', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const productData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.showSuccess('Product updated successfully!');
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.snackBar.open('Failed to update product', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.showSuccess('Product added successfully!');
        },
        error: (err) => {
          console.error('Error adding product:', err);
          this.snackBar.open('Failed to add product', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  showSuccess(message: string) {
    this.isLoading = false;
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['/dashboard/products']);
  }

  onCancel() {
    if (this.isLoading) return;
    this.router.navigate(['/dashboard/products']);
  }

}


