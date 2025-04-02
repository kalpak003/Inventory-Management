// buyer-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuyerService } from '../../../services/buyer.service';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common'; // Add this import
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router'; // Add this import




@Component({
  selector: 'app-buyer-details',
  templateUrl: './buyer-details.component.html',
  styleUrls: ['./buyer-details.component.css'],
  standalone: true, // Ensure this is true
  imports: [
    RouterModule,
    NgIf, // Add NgIf here
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
})
export class BuyerDetailsComponent implements OnInit {
  buyer: any;
  isAdmin: boolean = false;
  isLoading: boolean = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private buyerService: BuyerService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        console.log(`Fetching details for Buyer ID: ${id}`); // Debugging log
        this.buyerService.getBuyerById(id).subscribe(
          (data) => this.buyer = data,
          (error) => console.error('Error fetching buyer details:', error)
        );
      }
    });
  }

  loadBuyerDetails(id: number): void {
    console.log(`Fetching details for Buyer ID: ${id}`);  // Debugging
  
    this.buyerService.getBuyerById(id).subscribe({
      next: (data) => {
        console.log("Received buyer details:", data);  // Debugging
        this.buyer = data;  // Store response in component property
      },
      error: (err) => console.error("Error fetching buyer details:", err)
    });
  }
  
  
}