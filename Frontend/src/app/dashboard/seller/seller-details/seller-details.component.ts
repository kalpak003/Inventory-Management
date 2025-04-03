import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerService } from '../../../services/seller.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';  // ✅ Fix for mat-icon error
import { MatFormFieldModule } from '@angular/material/form-field';  // ✅ Fix for mat-form-field error
import { MatInputModule } from '@angular/material/input';  // ✅ Required for input fields

@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule, FormsModule,  MatInputModule, MatFormFieldModule, MatIconModule,  ]
})
export class SellerDetailsComponent implements OnInit {
  isLoading: boolean = true;
  seller: any = null;

  constructor(
    private route: ActivatedRoute,
    private sellerService: SellerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sellerId = this.route.snapshot.paramMap.get('id');
    if (sellerId) {
      this.fetchSellerDetails(sellerId);
    }
  }

  fetchSellerDetails(id: string): void {
    const numericId = Number(id);
  
    if (isNaN(numericId)) {
      console.error('Invalid seller ID:', id);
      return;
    }
  
    this.sellerService.getSellerById(numericId).subscribe({
      next: (data) => {
        console.log('Seller Data:', data); // ✅ Debugging API response
        this.seller = data;
  
        // ✅ Ensure Company Name is Defined
        if (!this.seller.company_name) {
          this.seller.company_name = 'N/A';
        }
  
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching seller details', error);
        this.isLoading = false;
      }
    });

  
  
    this.sellerService.getSellerById(numericId).subscribe({
      next: (data) => {
        this.seller = {
          companyname: data.companyname,  // ✅ Fixed property name
          concernedperson: data.concernedperson,
          address: data.address,
          contact: data.contact,
          email: data.email,
          gstno: data.gstno
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching seller details', error);
        this.isLoading = false;
      }
    });
  }

  navigateToSellerList(): void {
    this.router.navigate(['/sellers']);  // ✅ Navigate back to seller list
  }
  
}
