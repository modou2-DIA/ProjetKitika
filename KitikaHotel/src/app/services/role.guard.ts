// src/app/services/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * data.role  -> string unique
   * data.roles -> string[] pour permettre plusieurs rôles
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Normalisation : accepte data.role (string) ou data.roles (array)
    const required = route.data?.['role'] ?? route.data?.['role'] ?? null;
    const allowedRoles: string[] = Array.isArray(required) ? required : (required ? [required] : []);

    // 1) Si pas authentifié : renvoyer vers login (avec returnUrl)
    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // 2) Récupérer le rôle courant (méthode synchrone dans ton AuthService)
    const userRole = this.auth.getRole();
    if (!userRole) {
      return this.router.createUrlTree(['/unauthorized']);
    }

    // 3) ADMIN shortcut : si l'utilisateur est Admin, il accède à tout
    if (userRole === 'ADMIN') {
      return true;
    }

    // 4) Si aucune contrainte de rôle déclarée → permettre l'accès
    if (allowedRoles.length === 0) {
      return true;
    }

    // 5) Vérification de correspondance (exact match)
    if (allowedRoles.some(r => r === userRole)) {
      return true;
    }

    // 6) Sinon accès refusé
    return this.router.createUrlTree(['/unauthorized']);
  }
}
