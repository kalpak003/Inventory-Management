// sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { name: 'Buyer', icon: 'person', route: '/dashboard/buyer' },
    { name: 'Seller', icon: 'store', route: '/dashboard/seller' },
    { name: 'Products', icon: 'shopping_bag', route: '/dashboard/products' },
    { name: 'Transactions', icon: 'receipt_long', route: '/dashboard/transaction-segment' }
  ];
}