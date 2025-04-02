// buyer-list.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuyerService } from '../../../services/buyer.service';
import { CommonModule } from '@angular/common'; // Add this import
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-buyer-list',
  templateUrl: './buyer-list.component.html',
  styleUrls: ['./buyer-list.component.css'],
  standalone: true,
  imports: [
    CommonModule, // Add this
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
})
export class BuyerListComponent {
  buyers: any[] = [];
  isLoading = true;
  isAdmin = false; // Add this property


  constructor(
    private buyerService: BuyerService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadBuyers();
    this.checkAdminStatus();
  }

  checkAdminStatus(): void {
    this.isAdmin = this.authService.getCurrentUser()?.role === 'admin';
  }

  loadBuyers(): void {
    this.buyerService.getBuyers().subscribe({
      next: (data) => {
        this.buyers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading buyers:', err);
        this.isLoading = false;
      }
    });
  }

  navigateToAddBuyer(): void {
    this.router.navigate(['/dashboard/buyer/add']);
  }

  viewDetails(id: number): void {
    this.router.navigate([`/dashboard/buyer/${id}`]); // Correct routing format
  }
  
  addBuyer(): void {
    this.router.navigate(['/dashboard/buyer/add']);
  }

}