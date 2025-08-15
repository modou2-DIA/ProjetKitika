import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { Observable } from 'rxjs'; // Importez Observable

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, FormsModule, RouterLinkActive, RouterLink],
  standalone: true
})
export class NavbarComponent {
  // Exposez les Observables pour le template
  public isAuthenticated$: Observable<boolean>;
  public userRole$: Observable<string | null>;
  public userName$: Observable<string | null>;
  showLogoutConfirm = false; // Contrôle du modal

  constructor(public auth: AuthService, private router: Router) {
    // Initialisation des Observables du service
    this.isAuthenticated$ = this.auth.authStatus$;
    this.userRole$ = this.auth.userRole$;
    this.userName$ = this.auth.userName$;
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
