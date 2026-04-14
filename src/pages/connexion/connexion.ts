import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';

export const USER_SESSION_KEY = 'user';

@Component({
  templateUrl: 'connexion.html',
  styleUrl: 'connexion.css',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnexionPage implements OnInit {
  private readonly auth = inject(Auth);

  user = signal<any>(null);

  ngOnInit(): void {
    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((res) => {
        const user: any = {
          token: (res.user as any).accessToken || null,
          displayName: res.user.displayName,
          email: res.user.email,
          uid: res.user.uid,
        };

        this.user.set(user);

        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));

        window.open('http://localhost:4200/home', '_blank');
      })
      .catch((err) => console.error(err));
  }
}
