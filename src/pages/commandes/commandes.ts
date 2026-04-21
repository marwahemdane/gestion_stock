import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

// Importe tes services réels ici (ajuste les chemins selon ton projet)
// import { CommandeService } from '../../services/commande.service';
// import { ClientService } from '../../services/client.service';
// import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './commandes.html',
  styleUrl: './commandes.css',
})
export class CommandesPage implements OnInit {
  private fb = inject(FormBuilder);
  // private commandeService = inject(CommandeService); // Décommente quand tes services sont prêts
  // private clientService = inject(ClientService);
  // private articleService = inject(ArticleService);

  // Status de chargement
  loadingClients = signal(false);
  loadingArticles = signal(false);
  loadingCommandes = signal(false);

  // Gestion UI
  showAddForm = signal(false);
  errorMessage = signal('');
  form: FormGroup;

  // Données
  dataSource = signal<any[]>([]);
  displayedColumns: string[] = ['date', 'client', 'article', 'actions'];
  clientsList = signal<any[]>([]);
  articlesList = signal<any[]>([]);

  constructor() {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      articleId: ['', Validators.required],
      date: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadingCommandes.set(true);

    // Simuler le chargement ou appeler tes services :
    // this.clientService.getClients().subscribe(res => this.clientsList.set(res));
    // this.articleService.getArticles().subscribe(res => this.articlesList.set(res));
    // this.commandeService.getCommandes().subscribe(res => {
    //    this.dataSource.set(res);
    //    this.loadingCommandes.set(false);
    // });
  }

  // Correction de l'erreur "Expected 0 arguments, but got 1"
  handleFormDisplay(event?: any): void {
    this.showAddForm.update((val) => !val);
    if (!this.showAddForm()) {
      this.form.reset({ date: new Date() });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loadingCommandes.set(true);
      const nouvelleCommande = this.form.value;

      console.log('Envoi de la commande:', nouvelleCommande);

      // Simulation succès
      setTimeout(() => {
        this.showAddForm.set(false);
        this.loadingCommandes.set(false);
        this.form.reset({ date: new Date() });
      }, 1000);
    }
  }

  // Fonctions pour afficher les noms au lieu des IDs dans la table
  getClient(id: string): string {
    const client = this.clientsList().find((c) => c.id === id);
    return client ? client.nom : 'Client inconnu';
  }

  getArticle(id: string): string {
    const article = this.articlesList().find((a) => a.id === id);
    return article ? article.designation : 'Article inconnu';
  }

  deleteCommande(id: string): void {
    if (confirm('Supprimer cette commande ?')) {
      // Logique de suppression
      console.log('Suppression id:', id);
    }
  }
}
