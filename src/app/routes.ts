import { Routes } from '@angular/router';
import { Connexion } from '../pages/connexion/connexion';
import { HomePage } from '../pages/home/home';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'connexion',
        component: Connexion
    }
];
