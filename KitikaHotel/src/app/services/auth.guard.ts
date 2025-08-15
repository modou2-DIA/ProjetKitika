import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginRequiredDialogComponent } from '../pages/login-required-dialog/login-required-dialog.component';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    const isAuth = this.auth.isAuthenticated();
    const expectedRole = route.data['role'] as string | undefined;
    const userRole = this.auth.getRole();

    // 1. Vérification de l'authentification
    if (!isAuth) {
      const dialogRef = this.dialog.open(LoginRequiredDialogComponent, {
        width: '400px',
        disableClose: true
      });

      return dialogRef.afterClosed().pipe(
        switchMap(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }

    // 2. Vérification du rôle de l'utilisateur
    // Normalisation des rôles pour éviter les problèmes de casse
    if (expectedRole && userRole && userRole.toLowerCase() !== expectedRole.toLowerCase()) {
      // TODO: Afficher un modal d'erreur pour les autorisations insuffisantes.
      // this.router.navigate(['/unauthorized']);
      return false; // Empêche l'accès si le rôle ne correspond pas
    }

    // L'utilisateur est authentifié et a le bon rôle
    return true;
  }
}
