import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
// AJOUTE CETTE LIGNE :
import { RouterLink } from '@angular/router';

import { USER_SESSION_KEY } from '../connexion/connexion';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.html',
  styleUrl: 'profile.css',
  standalone: true,
  // Maintenant RouterLink est reconnu ici
  imports: [MatButtonModule, MatDividerModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  user = signal<any>(null);

  ngOnInit(): void {
    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);
  }
}
