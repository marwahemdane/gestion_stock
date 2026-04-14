import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Auth, signOut } from '@angular/fire/auth';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

import { USER_SESSION_KEY } from '../../pages/connexion/connexion';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
  styleUrl: 'navbar.css',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
})
export class Navbar implements OnInit {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  user = signal<any>(null);
  currentUrl = signal<string>('');

  ngOnInit(): void {
    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.url);
      });
  }

  logout() {
    return signOut(this.auth).then(() => {
      localStorage.removeItem(USER_SESSION_KEY);
      // this.router.createUrlTree(['/connexion'])
      this.router.navigateByUrl('/connexion');
      this.user.set(null);
    });
  }

  isCurrentUrl(url: string): string {
    return this.currentUrl() === url ? 'filled' : '';
  }
}
