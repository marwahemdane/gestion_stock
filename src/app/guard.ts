import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { USER_SESSION_KEY } from '../pages/connexion/connexion';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const data = localStorage.getItem(USER_SESSION_KEY);
  const user = data ? JSON.parse(data) : null;

  if (user && (route.routeConfig as any).path === 'connexion')
    return router.createUrlTree(['/home']); // redirection
  else if (user) {
    return true; // autorisé
  } else {
    return router.createUrlTree(['/connexion']); // redirection
  }
};
