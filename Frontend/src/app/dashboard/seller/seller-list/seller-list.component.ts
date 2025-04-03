import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from '../../../services/seller.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatDialogModule} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';




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
    RouterModule,
    MatDialogModule
  ],
})
export class SellerListComponent {
  sellers: any[] = [];
  isLoading = true;
  isAdmin = false;

  constructor(
    private sellerService: SellerService,
    private router: Router,
    private authService: AuthService
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

  navigateToSeller(id: number): void {
    this.router.navigate(['/dashboard/seller', id]);
  }

  
  viewDetails(sellerId: number): void {
    this.router.navigate([`/dashboard/seller/${sellerId}`]); // ✅ Ensure path is correct
  }

  addSeller(): void {
    this.router.navigate(['/dashboard/sellers/add']);
  }
}
