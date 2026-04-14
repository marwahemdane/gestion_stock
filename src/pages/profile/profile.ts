import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { USER_SESSION_KEY } from '../connexion/connexion';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  templateUrl: 'profile.html',
  imports: [MatButtonModule, MatDividerModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  user = signal<any>(null);

  ngOnInit(): void {
    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);
  }
}
