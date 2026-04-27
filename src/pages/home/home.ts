import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { USER_SESSION_KEY } from '../connexion/connexion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  user = signal<any>(null);

  ngOnInit(): void {
    const sessionData =
      localStorage.getItem(USER_SESSION_KEY) || localStorage.getItem('user_session');

    if (sessionData) {
      try {
        this.user.set(JSON.parse(sessionData));
      } catch (e) {
        console.error('Erreur de lecture de la session', e);
        this.user.set(null);
      }
    }
  }
}
