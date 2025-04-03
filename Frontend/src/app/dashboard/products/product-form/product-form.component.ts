// products/product-form/product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

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
    MatButtonModule,
    MatSelectModule,
    MatCardModule
  ]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId?: number;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.productForm = this.fb.group({
      productname: ['', Validators.required],
      category: ['', Validators.required],
      producttype: [''],
      modelno: [''],
      description: [''],
      unit: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      status: ['available', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.isLoading = true;
    const productData = this.productForm.value;

    const operation = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, productData)
      : this.productService.createProduct(productData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error saving product', err);
        this.isLoading = false;
      }
    });
  }
}