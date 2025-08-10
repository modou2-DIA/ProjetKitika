import { Component } from '@angular/core';
import { ClientsComponent } from '../../pages/clients/clients.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { FacturationComponent } from '../../pages/facturation/facturation.component';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
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
