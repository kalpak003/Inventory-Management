import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-buyer',
  standalone: true, // Ensure it's a standalone component
  template: `
    <h2>Buyer Dashboard</h2>
    <router-outlet></router-outlet> <!-- This ensures child components appear -->
  `,
  imports: [RouterModule] // Import RouterModule to use <router-outlet>
})
export class BuyerComponent {}
