import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { Observable } from 'rxjs'; // Importez Observable
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, FormsModule, RouterLinkActive, RouterLink,RouterOutlet],
  standalone: true
})
export class NavbarComponent {
  public isAuthenticated$: Observable<boolean>;
  public userRole$: Observable<string | null>;
  public userName$: Observable<string | null>;
  public showLogoutConfirm = false;
  public sidebarOpen = false;

  constructor(public auth: AuthService, private router: Router) {
    this.isAuthenticated$ = this.auth.authStatus$;
    this.userRole$ = this.auth.userRole$;
    this.userName$ = this.auth.userName$;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleLogoutConfirm() {
    this.showLogoutConfirm = !this.showLogoutConfirm;
  }

  confirmLogout() {
    this.auth.logout();
    this.showLogoutConfirm = false;
    this.router.navigate(['/']);
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}
