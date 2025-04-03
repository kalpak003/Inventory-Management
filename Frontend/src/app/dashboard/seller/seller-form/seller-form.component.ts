import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../../../services/seller.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-seller-form',
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.css'],
  standalone: true,
  imports: [
    CommonModule, // Required for *ngIf
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
})
export class SellerFormComponent implements OnInit {
  sellerForm!: FormGroup;
  isEditMode = false; // Change based on edit mode

  // Sample data (Replace with API data)
  sellerData = {
    company_name: 'ABC Traders',
    concernedperson: 'John Doe',
    address: '123 Street, City',
    contact: '9876543210',
    email: 'abc@example.com',
    gstno: 'GST1234567'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Initialize form
    this.sellerForm = this.fb.group({
      company_name: ['', Validators.required],
      concernedperson: ['', Validators.required],
      address: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      gstno: ['', Validators.required]
    });

    // Populate form with data if in edit mode
    if (this.isEditMode) {
      this.sellerForm.patchValue(this.sellerData);
    }
  }

  onSubmit() {
    if (this.sellerForm.valid) {
      console.log('Form Data:', this.sellerForm.value);
      // Call API to save data
    }
  }

  navigateToSellerList() {
    console.log('Navigating back to seller list...');
    // Add navigation logic here
  }
}

