import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../../../services/seller.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-form',
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule // ✅ Added missing import
  ],
})
export class SellerFormComponent implements OnInit {
  sellerForm!: FormGroup;
  isEditMode = false;
  sellerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.sellerForm = this.fb.group({
      companyname: ['', Validators.required],
      concernedperson: ['', Validators.required],
      address: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      gstno: ['', Validators.required]
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.sellerId = +id;
        this.loadSellerData(this.sellerId);
      }
    });
  }

  // Load existing seller data when editing
  loadSellerData(id: number) {
    this.sellerService.getSellerById(id).subscribe({
      next: (seller) => this.sellerForm.patchValue(seller),
      error: (err) => console.error('Error loading seller:', err)
    });
  }

  onSubmit() {
    if (this.sellerForm.valid) {
      const sellerData = this.sellerForm.value;
  
      if (this.isEditMode && this.sellerId) {
        this.sellerService.updateSeller(this.sellerId, sellerData).subscribe({
          next: () => {
            this.showSuccess('Seller updated successfully!');
            this.router.navigate(['/dashboard/seller']); // Navigate back to the seller list
          },
          error: (err) => {
            console.error('Error updating seller:', err);
          }
        });
      } else {
        this.sellerService.createSeller(sellerData).subscribe({
          next: () => {
            this.showSuccess('Seller added successfully!');
            this.router.navigate(['/dashboard/seller']); // Navigate back to the seller list
          },
          error: (err) => {
            console.error('Error adding seller:', err);
          }
        });
      }
    }
  }
  
  

  // Cancel button functionality
  onCancel() {
    this.router.navigate(['/sellers']); // Navigate to seller list page
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['/sellers']); 
  }
  
}
