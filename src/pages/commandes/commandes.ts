import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

const MOCK_COMMANDES = [
  {
    id: 'cmd1',
    clientId: 'c1',
    dateCommande: new Date().toISOString(),
    dateLivraison: '2026-04-20',
    totalQuantity: 3,
    articles: {
      a1: { quantity: 1, price: 1500 },
      a2: { quantity: 2, price: 50 },
    },
  },
];
@Component({
  templateUrl: 'commandes.html',
  styleUrl: 'commandes.css',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandesPage implements OnInit {
  displayedColumns: string[] = [
    //'id',
    'client',
    'dateCommande',
    'dateLivraison',
    'articles',
    'totalQuantity',
  ];
  dataSource = MOCK_COMMANDES;

  ngOnInit(): void {}
}
