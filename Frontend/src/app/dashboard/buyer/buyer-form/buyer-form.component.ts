// buyer-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuyerService } from '../../../services/buyer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-buyer-form',
  templateUrl: './buyer-form.component.html',
  styleUrls: ['./buyer-form.component.css'],
  standalone: true,
  imports: [
    CommonModule, // Add this for *ngIf
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
})
export class BuyerFormComponent implements OnInit {
  buyerForm: FormGroup;
  isEditMode = false;
  buyerId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private buyerService: BuyerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.buyerForm = this.fb.group({
      company_name: ['', Validators.required],
      concernedperson: ['', Validators.required],
      address: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      gstno: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.buyerId = +params['id'];
        this.loadBuyerData(this.buyerId);
      }
    });
  }

  loadBuyerData(id: number): void {
    this.buyerService.getBuyerById(id).subscribe({
      next: (data) => this.buyerForm.patchValue(data),
      error: (err) => console.error('Error loading buyer:', err)
    });
  }

  onSubmit(): void {
    if (this.buyerForm.valid) {
      this.isLoading = true;
      const formData = this.buyerForm.value;

      const operation = this.isEditMode
        ? this.buyerService.updateBuyer(this.buyerId!, formData)
        : this.buyerService.createBuyer(formData);

      operation.subscribe({
        next: (response) => {
          const message = this.isEditMode 
            ? 'Buyer updated successfully!' 
            : 'Buyer added successfully!';
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/buyer']);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Operation failed', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  navigateToBuyerList(): void {
    this.router.navigate(['/dashboard/buyer']);
  }
}