import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router'; // Added Router import
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    SidebarComponent,
    MatIconModule,
    UserProfileComponent,
    RouterModule,
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    MatTooltipModule
  ],
  standalone: true
})
export class DashboardComponent implements OnInit {
  userName: string = 'John Doe';
  userInitials: string = this.getInitials(this.userName);
  timeLeft: number = 3600;
  formattedTime: string = '01:00:00';
  private timerInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.startTimer();
  }

  private getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.formatTime();
      } else {
        this.logout();
      }
    }, 1000);
  }

  formatTime(): void {
    const hours = Math.floor(this.timeLeft / 3600);
    const minutes = Math.floor((this.timeLeft % 3600) / 60);
    const seconds = this.timeLeft % 60;
    this.formattedTime = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  logout(): void {
    clearInterval(this.timerInterval);
    this.authService.logout();
    this.router.navigate(['/login']); // Add this line to navigate to login page
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  // dashboard.component.ts
navigateToTransaction(): void {
  this.router.navigate(['/dashboard/transactions']);  // Note the full path
}
}