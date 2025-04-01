import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Required for any Angular app
import { CommonModule } from '@angular/common'; // Needed for *ngIf and other directives
import { HttpClientModule } from '@angular/common/http'; // HTTP requests
import { FormsModule } from '@angular/forms'; // For two-way binding

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'; // For mat-form-field and mat-error
import { MatInputModule } from '@angular/material/input';

// Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule, // Add this for *ngIf
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule, // This imports mat-error as well
    MatInputModule
  ],
  bootstrap: [LoginComponent] // Or set the starting component here
})
export class AppModule {}
