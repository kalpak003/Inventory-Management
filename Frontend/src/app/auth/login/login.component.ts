import { Component } from '@angular/core';
import {ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
// Update these imports in both login.component.ts and register.component.ts
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component(
  {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,ReactiveFormsModule],
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  navigateToRegister(): void {
  this.router.navigate(['/register']);
}

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Here's where it gets initialized
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(
        this.loginForm.value.username!,
        this.loginForm.value.password!
      ).subscribe({
        next: (response) => {
          console.log("Login successful, navigating to dashboard...");
          this.isLoading = false;
          this.router.navigate(['/dashboard']); // Ensure navigation happens here
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed';
          console.error('Login error:', err);
          this.isLoading = false;
        }
      });
  }
}
}
