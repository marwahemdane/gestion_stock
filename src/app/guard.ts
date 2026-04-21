import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { USER_SESSION_KEY } from '../pages/connexion/connexion';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 1. Récupération des données brutes
  const data = localStorage.getItem(USER_SESSION_KEY);

  let user = null;

  // 2. Tentative de lecture des données utilisateur
  try {
    if (data) {
      user = JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur : Les données de session sont corrompues.', error);
    localStorage.removeItem(USER_SESSION_KEY); // On nettoie si c'est illisible
    user = null;
  }

  // 3. Logique de redirection
  const isConnexionPath = route.routeConfig?.path === 'connexion';

  if (user) {
    // Si l'utilisateur est connecté :
    // S'il essaie d'aller sur 'connexion', on le renvoie vers 'home'
    if (isConnexionPath) {
      return router.createUrlTree(['/home']);
    }
    // Sinon, on le laisse passer sur la page demandée
    return true;
  } else {
    // Si l'utilisateur n'est PAS connecté :
    // S'il va vers 'connexion', on le laisse passer
    if (isConnexionPath) {
      return true;
    }
    // Pour tout le reste, on le force à se connecter
    return router.createUrlTree(['/connexion']);
  }
};
