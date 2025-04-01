// dashboard.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    SidebarComponent, 
    MatIconModule, // <-- Add this
    UserProfileComponent,
    RouterModule, // Add RouterModule
    RouterOutlet // <-- Add this
  ],
  standalone: true,
  template: `
  <div class="dashboard-container">
    <!-- Your sidebar -->
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  </div>
`,
styles: [`
  .dashboard-container { display: flex; height: 100vh; }
  .main-content { flex: 1; padding: 20px; }
`]
})
export class DashboardComponent {
  userName: string = 'John Doe'; // Replace with actual user name
  userInitials: string = this.getInitials(this.userName);

  constructor(private authService: AuthService) {}

  private getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}