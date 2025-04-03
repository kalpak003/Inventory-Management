import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from '../../../services/seller.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
})
export class SellerListComponent implements OnInit {
  sellers: any[] = [];
  isLoading = true;
  isAdmin = false;

  constructor(
    private sellerService: SellerService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSellers();
    this.checkAdminStatus();
  }

  checkAdminStatus(): void {
    this.isAdmin = this.authService.getCurrentUser()?.role === 'admin';
  }

  loadSellers(): void {
    this.sellerService.getSellers().subscribe({
      next: (data) => {
        this.sellers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading sellers:', err);
        this.isLoading = false;
      }
    });
  }

  viewDetails(sellerId: number): void {
    this.router.navigate([`/dashboard/seller/${sellerId}`]); // ✅ Ensure path is correct
  }

  addSeller(): void {
    this.router.navigate(['/dashboard/seller/add']); // ✅ Ensure the correct path
  }
  

  editSeller(seller: any): void {
    // Ensure you're navigating to the correct path with the seller's ID
    this.router.navigate([`/dashboard/seller/${seller.id}/edit`]);
  }
  


  deleteSeller(sellerId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this seller?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sellerService.deleteSeller(sellerId).subscribe(() => {
          this.loadSellers();
        });
      }
    });
  }
}
