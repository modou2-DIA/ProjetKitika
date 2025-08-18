
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Intercepteur pour ajouter le jeton JWT à chaque requête.
 * Cette version fonctionnelle est la méthode recommandée pour les applications standalone.
 */
export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Clone la requête et ajoute l'en-tête d'autorisation
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Si pas de jeton, passe la requête sans modification
  return next(req);
};
