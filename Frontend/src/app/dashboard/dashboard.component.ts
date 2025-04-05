import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router'; // Added Router import
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransactionService } from '../services/transaction.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    SidebarComponent,
    MatIconModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
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
    private router: Router,
    private transactionService: TransactionService,
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
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  // dashboard.component.ts
navigateToTransaction(): void {
  this.router.navigate(['/dashboard/transactions']);
}


}