import { Routes } from '@angular/router';
import { ConnexionPage } from '../pages/connexion/connexion';
import { HomePage } from '../pages/home/home';
import { StockPage } from '../pages/stock/stock';
import { authGuard } from './guard';
import { CommandesPage } from '../pages/commandes/commandes';
import { ProfilePage } from '../pages/profile/profile';
import { ClientsPage } from '../pages/clients/clients';
import { MouvementsPage } from '../pages/mouvement/mouvement';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [authGuard],
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [authGuard],
  },
  {
    path: 'connexion',
    component: ConnexionPage,
  },
  {
    path: 'stock',
    component: StockPage,
    canActivate: [authGuard],
  },
  {
    path: 'commandes',
    component: CommandesPage,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [authGuard],
  },
  {
    path: 'clients',
    component: ClientsPage,
    canActivate: [authGuard],
  },
  {
    path: 'mouvements',
    component: MouvementsPage,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
