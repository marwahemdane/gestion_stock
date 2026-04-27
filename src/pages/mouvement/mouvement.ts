import { Component, OnInit, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommandeService } from '../../services/commande.service';

@Component({
  selector: 'app-mouvement',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './mouvement.html',
  styleUrl: './mouvement.css',
  encapsulation: ViewEncapsulation.None,
})
export class MouvementsPage implements OnInit {
  private commandeService = inject(CommandeService);

  dataSource = signal<any[]>([]);

  ngOnInit() {
    this.commandeService.getMouvements().subscribe({
      next: (res: any) => {
        if (res) {
          const data = Object.entries(res).map(([id, val]: any) => ({
            id,
            ...val,
            articleName: val.articleName || val.articleLabel || 'Article inconnu',
          }));
          this.dataSource.set(data.reverse());
        } else {
          this.dataSource.set([]);
        }
      },
      error: (err: any) => console.error('Erreur chargement mouvements:', err),
    });
  }
}
