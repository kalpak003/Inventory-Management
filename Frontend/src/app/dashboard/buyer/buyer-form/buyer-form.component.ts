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
  buyers: any[] = [];
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private buyerService: BuyerService,
    private route: ActivatedRoute,
    private router: Router
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
        this.loadBuyers();
      }
    });
  }

  loadBuyers(): void {
    console.log('Loading buyers...'); // Debug log
    this.buyerService.getBuyers().subscribe({
      next: (data) => {
        this.buyers = data;
        this.isLoading = false;
        console.log('Buyers loaded successfully', data); // Debug log
      },
      error: (err) => {
        console.error('Failed to load buyers:', err); // Debug log
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.buyerForm.valid) {
      const buyerData = this.buyerForm.value;
      const operation = this.isEditMode 
        ? this.buyerService.updateBuyer(this.buyerId!, buyerData)
        : this.buyerService.createBuyer(buyerData);

      operation.subscribe(
        () => this.router.navigate(['/dashboard/buyer']),
        (error) => console.error('Error saving buyer:', error)
      );
    }
  }

  navigateToBuyerList(): void {
    this.router.navigate(['/dashboard/buyer']);
  }
}