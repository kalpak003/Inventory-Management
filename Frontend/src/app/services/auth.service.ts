import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenSubject: BehaviorSubject<string | null>;

  constructor(private http: HttpClient,private router: Router ) {
    this.tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  login(email: string, password: string): Observable<string> {
    const body = { email, password };
    console.log('Sending login request with:', body); // Debug log
    
    return this.http.post<string>(`${this.apiUrl}/login`, body).pipe(
      tap({
        next: (token) => {
          console.log('Received token:', token); // Debug log
          if (token) {
            localStorage.setItem('token', token);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('Login error:', err); // Debug log
        }
      })
    );
  }
  
  register(username: string, email: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, {
      username, email, password, role: 'user'
    }).pipe(
      tap((token: string) => {
        if (token) {
          localStorage.setItem('token', token);
          this.tokenSubject.next(token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}