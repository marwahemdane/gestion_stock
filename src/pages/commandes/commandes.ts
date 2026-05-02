import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { USER_SESSION_KEY } from '../connexion/connexion';
import { ClientService } from '../../services/client.service';
import { ArticleService } from '../../services/article.service';
import { CommandeService } from '../../services/commande.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './commandes.html',
  styleUrl: './commandes.css',
})
export class CommandesPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientsService = inject(ClientService);
  private articlesService = inject(ArticleService);
  private commandesService = inject(CommandeService);

  user = signal<any>(null);
  showAddForm = signal(false);
  isEditing = signal(false);
  editId = signal<string | null>(null);

  clientsList = signal<any[]>([]);
  articlesList = signal<any[]>([]);
  dataSource = signal<any[]>([]);

  form: FormGroup;
  displayedColumns: string[] = [
    'client',
    'article',
    'quantity',
    'dateCommande',
    'dateLivraison',
    'actions',
  ];

  constructor() {
    this.form = this.fb.group({
      client: ['', Validators.required],
      article: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      dateCommande: [new Date(), Validators.required],
      dateLivraison: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const session = localStorage.getItem(USER_SESSION_KEY);
    if (!session) {
      this.router.navigate(['/connexion']);
      return;
    }
    this.user.set(JSON.parse(session));
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.clientsService.getClients().subscribe((res) => {
      if (res) this.clientsList.set(Object.entries(res).map(([id, val]: any) => ({ id, ...val })));
    });
    this.articlesService.getArticles().subscribe((res) => {
      if (res) this.articlesList.set(Object.entries(res).map(([id, val]: any) => ({ id, ...val })));
    });
    this.commandesService.getCommandes().subscribe((res) => {
      if (res) this.dataSource.set(Object.entries(res).map(([id, val]: any) => ({ id, ...val })));
      else this.dataSource.set([]);
    });
  }

  getClientName(clientId: string): string {
    const client = this.clientsList().find((c) => c.id === clientId);
    return client ? `${client.lastname} ${client.firstname}` : 'Client inconnu';
  }

  getArticleName(articleId: string): string {
    const article = this.articlesList().find((a) => a.id === articleId);
    return article ? article.label : 'Article inconnu';
  }

  handleFormDisplay(visible: boolean): void {
    this.showAddForm.set(visible);
    if (!visible) {
      this.form.reset({ dateCommande: new Date() });
      this.isEditing.set(false);
      this.editId.set(null);
    }
  }

  onEdit(commande: any): void {
    this.isEditing.set(true);
    this.editId.set(commande.id);
    this.showAddForm.set(true);

    const parseDate = (dateStr: string) => {
      if (!dateStr) return null;
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    this.form.patchValue({
      client: commande.client,
      article: commande.article,
      quantity: commande.quantity,
      dateCommande: parseDate(commande.dateCommande) || new Date(),
      dateLivraison: parseDate(commande.dateLivraison),
    });
  }

  onDelete(id: string): void {
    if (confirm('Supprimer cette commande ?')) {
      this.commandesService.deleteCommande(id).then(() => this.loadInitialData());
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const val = this.form.value;
      const data = {
        ...val,
        dateCommande: formatDate(val.dateCommande, 'dd/MM/yyyy', 'en-US'),
        dateLivraison: formatDate(val.dateLivraison, 'dd/MM/yyyy', 'en-US'),
      };

      if (this.isEditing() && this.editId()) {
        this.commandesService
          .updateCommande(this.editId()!, data)
          .then(() => this.handleFormDisplay(false));
      } else {
        this.commandesService.createCommande(data).then(() => this.handleFormDisplay(false));
      }
    }
  }

  onPrint(element: any) {
    window.print();
  }

  logout() {
    localStorage.removeItem(USER_SESSION_KEY);
    this.router.navigate(['/connexion']);
  }
}
