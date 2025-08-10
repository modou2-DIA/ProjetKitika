import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isLoggedIn = false;

  constructor(private auth: AuthService, private router: Router) {
    this.isLoggedIn = this.auth.isAuthenticated();
  }

  confirmLogout() {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      this.auth.logout();
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }
  }
}
