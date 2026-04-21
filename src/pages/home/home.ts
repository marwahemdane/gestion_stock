import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// AJOUTE CES LIGNES ICI :
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  // C'est ici que tu les utilises, donc ils doivent être importés au-dessus
  imports: [CommonModule, RouterLink, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  user = signal<any>(null);

  ngOnInit(): void {
    const data = localStorage.getItem('user_session'); // Vérifie ta clé (USER_SESSION_KEY)
    if (data) {
      this.user.set(JSON.parse(data));
    }
  }
}
