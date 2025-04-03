import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuyerService } from '../../../services/buyer.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-buyer-list',
  templateUrl: './buyer-list.component.html',
  styleUrls: ['./buyer-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatDialogModule
  ],
})
export class BuyerListComponent {
  buyers: any[] = [];
  isLoading = true;
  isAdmin = false;
  selectedBuyerId: number | null = null;

  constructor(
    private buyerService: BuyerService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog // Dialog for delete confirmation
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
    this.router.navigate([`/dashboard/buyer/${id}`]);
  }
  
  addBuyer(): void {
    this.router.navigate(['/dashboard/buyer/add']);
  }

  editBuyer(buyerId: number, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Prevents clicking card
    }
    this.router.navigate(['/dashboard/buyer', buyerId, 'edit']);
  }

  confirmDelete(buyerId: number, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Prevents clicking card
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this buyer?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteBuyer(buyerId);
      }
    });
  }

  deleteBuyer(buyerId: number): void {
    this.buyerService.deleteBuyer(buyerId).subscribe({
      next: () => {
        this.buyers = this.buyers.filter(buyer => buyer.id !== buyerId);
      },
      error: err => {
        console.error('Error deleting buyer:', err);
      }
    });
  }
  
}
