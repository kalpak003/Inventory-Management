// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SellerListComponent } from './dashboard/seller/seller-list/seller-list.component';
import { SellerFormComponent } from './dashboard/seller/seller-form/seller-form.component';
import { SellerDetailsComponent } from './dashboard/seller/seller-details/seller-details.component';


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

      // ✅ Buyer Routes
      {
        path: 'buyer',
        loadComponent: () => import('./dashboard/buyer/buyer.component').then(m => m.BuyerComponent),
        children: [
          { path: '', loadComponent: () => import('./dashboard/buyer/buyer-list/buyer-list.component').then(m => m.BuyerListComponent) },
          { path: 'add', loadComponent: () => import('./dashboard/buyer/buyer-form/buyer-form.component').then(m => m.BuyerFormComponent) },
          { path: ':id', loadComponent: () => import('./dashboard/buyer/buyer-details/buyer-details.component').then(m => m.BuyerDetailsComponent) }, 
          { path: ':id/edit', loadComponent: () => import('./dashboard/buyer/buyer-form/buyer-form.component').then(m => m.BuyerFormComponent) }
        ]
      },

      {
        path: 'seller',  // ✅ Matches navigation links
        loadComponent: () => import('./dashboard/seller/seller.component').then(m => m.SellerComponent),
        children: [
          { path: '', component: SellerListComponent }, // Seller List View
          { path: 'add', component: SellerFormComponent }, // Add Seller Form
          { path: ':id', component: SellerDetailsComponent }, // Seller Details View
          { path: ':id/edit', component: SellerFormComponent }
        ]
      },
      
      

      { path: 'products', loadComponent: () => import('./dashboard/products/products.component').then(m => m.ProductsComponent) }
    ]
  }
];
