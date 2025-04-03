import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './../app/auth/login/login.component';
import { RegisterComponent } from './../app/auth/register/register.component';
import { DashboardComponent } from './../app/dashboard/dashboard.component';
import { BuyerListComponent } from './../app/dashboard/buyer/buyer-list/buyer-list.component';
import { BuyerFormComponent } from './../app/dashboard/buyer/buyer-form/buyer-form.component';
import { SellerListComponent } from './../app/dashboard/seller/seller-list/seller-list.component';
import { SellerDetailsComponent } from './../app/dashboard/seller/seller-details/seller-details.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Buyers
  { path: 'dashboard/buyer', component: BuyerListComponent },
  { path: 'dashboard/buyer/add', component: BuyerFormComponent },
  { path: 'dashboard/buyer/:id', component: BuyerFormComponent }, // Edit Buyer

  // Sellers
  { path: 'dashboard/seller', component: SellerListComponent },
  { path: 'dashboard/seller/:id', component: SellerDetailsComponent }, // 👈 Fix missing route

  // Default redirect
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
