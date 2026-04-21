import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MouvementService } from '../../services/mouvement.service';

@Component({
  selector: 'app-mouvement',
  standalone: true,
  imports: [CommonModule, MatIconModule, DatePipe],
  templateUrl: './mouvement.html',
  styleUrl: './mouvement.css',
})
export class MouvementPage implements OnInit {
  private mouvementService: any = inject(MouvementService);
  dataSource = signal<any[]>([]);

  ngOnInit(): void {
    this.chargerMouvements();
  }

  chargerMouvements(): void {
    this.mouvementService.getMouvements().subscribe({
      next: (res: any) => {
        if (res) {
          const data = Object.entries(res).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          }));
          this.dataSource.set(data.reverse());
        }
      },
      error: (err: any) => {
        console.error('Erreur :', err);
      },
    });
  }
}
