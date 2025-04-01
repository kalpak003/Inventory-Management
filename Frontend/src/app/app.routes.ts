// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BuyerComponent } from './dashboard/buyer/buyer.component';
import { SellerComponent } from './dashboard/seller/seller.component';
import { ProductsComponent } from './dashboard/products/products.component';

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
    path: '**', 
    redirectTo: 'login' 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'buyer', pathMatch: 'full' },
      { path: 'buyer', component: BuyerComponent },
      { path: 'seller', component: SellerComponent },
      { path: 'products', component: ProductsComponent }
    ]
  }
];