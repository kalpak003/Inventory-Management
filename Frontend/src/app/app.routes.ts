// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Import the guard

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) 
  },

  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard], // Protect dashboard
    children: [
      { path: '', redirectTo: 'buyer', pathMatch: 'full' },
      { path: 'buyer', loadComponent: () => import('./dashboard/buyer/buyer.component').then(m => m.BuyerComponent) },
      { path: 'seller', loadComponent: () => import('./dashboard/seller/seller.component').then(m => m.SellerComponent) },
      { path: 'products', loadComponent: () => import('./dashboard/products/products.component').then(m => m.ProductsComponent) }
    ]
  }
];