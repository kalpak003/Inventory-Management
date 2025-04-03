import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SellerDetailsComponent } from './dashboard/seller/seller-details/seller-details.component'; // ✅ Import this component

// Services
import { SellerService } from './services/seller.service';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    SellerDetailsComponent // ✅ Add this component
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  bootstrap: [LoginComponent], 
  providers: [SellerService]
})
export class AppModule {}
