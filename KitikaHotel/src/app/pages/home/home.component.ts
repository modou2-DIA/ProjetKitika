import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  // Exposez les Observables pour le template
  isAuthenticated$!: Observable<boolean>;
  userName$!: Observable<string | null>;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Initialise les Observables à partir du service d'authentification
    this.isAuthenticated$ = this.authService.authStatus$;
    this.userName$ = this.authService.userName$;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
