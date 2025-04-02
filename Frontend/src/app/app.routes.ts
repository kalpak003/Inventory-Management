// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

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
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'buyer', pathMatch: 'full' },
      
      // Consolidated buyer routes
      {
      path: 'buyer',
      loadComponent: () => import('./dashboard/buyer/buyer.component').then(m => m.BuyerComponent),
      children: [
        { path: '', loadComponent: () => import('./dashboard/buyer/buyer-list/buyer-list.component').then(m => m.BuyerListComponent) },
        { path: 'add', loadComponent: () => import('./dashboard/buyer/buyer-form/buyer-form.component').then(m => m.BuyerFormComponent) },
        { path: ':id', loadComponent: () => import('./dashboard/buyer/buyer-details/buyer-details.component').then(m => m.BuyerDetailsComponent) }, // Add this line
        { path: ':id/edit', loadComponent: () => import('./dashboard/buyer/buyer-form/buyer-form.component').then(m => m.BuyerFormComponent) }
        ]
      },
      
      { path: 'seller', loadComponent: () => import('./dashboard/seller/seller.component').then(m => m.SellerComponent) },
      { path: 'products', loadComponent: () => import('./dashboard/products/products.component').then(m => m.ProductsComponent) }
    ]
  }
];