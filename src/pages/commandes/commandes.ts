import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from '../../services/client.service';
import { Article } from '../stock/stock';
import { Client } from '../clients/clients';
import { USER_SESSION_KEY } from '../connexion/connexion';
import { CommandeService } from '../../services/commande.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ArticleService } from '../../services/article.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
  templateUrl: 'commandes.html',
  styleUrl: 'commandes.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clientsService = inject(ClientService);
  private readonly articlesService = inject(ArticleService);
  private readonly commandesService = inject(CommandeService);

  user = signal<any>(null);
  displayedColumns: string[] = ['client', 'dateCommande', 'dateLivraison', 'articles', 'quantity'];
  clientsList = signal<Client[]>([]);
  articlesList = signal<Article[]>([]);
  dataSource = signal<any[]>([]);

  form!: FormGroup;
  showAddForm = signal(false);

  loadingClients = signal(true);
  loadingArticles = signal(true);
  loadingCommandes = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      article: [null, Validators.required],
      client: [null, Validators.required],
      dateCommande: [null, Validators.required],
      dateLivraison: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
    });

    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);

    this.clientsService.getClients().subscribe((res) => {
      if (res) {
        const data = Object.entries(res).map(([key, value]: any) => ({
          id: key,
          ...value,
        }));
        this.clientsList.set(data);
        this.loadingClients.set(false);
      } else {
        this.clientsList.set([]);
        this.loadingClients.set(false);
      }
    });

    this.articlesService.getArticles().subscribe((res) => {
      if (res) {
        const data = Object.entries(res).map(([key, value]: any) => ({
          id: key,
          ...value,
        }));
        this.articlesList.set(data);
        this.loadingArticles.set(false);
      } else {
        this.articlesList.set([]);
        this.loadingArticles.set(false);
      }
    });

    this.commandesService.getCommandes().subscribe((res) => {
      if (res) {
        const data = Object.entries(res).map(([key, value]: any) => ({
          id: key,
          ...value,
        }));
        this.dataSource.set(data);
        this.loadingCommandes.set(false);
      } else {
        this.dataSource.set([]);
        this.loadingCommandes.set(false);
      }
    });
  }

  onSubmit() {
    const data = {
      ...this.form.value,
      dateCommande: formatDate(this.form.value.dateCommande, 'dd-MM-yyyy', 'en-US'),
      dateLivraison: formatDate(this.form.value.dateLivraison, 'dd-MM-yyyy', 'en-US'),
    };

    if (this.form.valid) {
      this.commandesService.createCommande(data).then((response: any) => {
        console.log('response :: ', response);
        if (response?.error) {
          this.errorMessage.set(response.message);
        } else {
          this.handleFormDisplay(false);
          this.errorMessage.set(null);
        }
      });
    }
  }

  handleFormDisplay(isVisisble: boolean) {
    if (isVisisble) {
      this.showAddForm.set(true);
    } else {
      this.showAddForm.set(false);
      this.form.reset();
    }
    this.errorMessage.set(null);
  }

  getClient(id: string): string {
    const client = this.clientsList().find((client) => client.id === id);
    return `${client?.lastname} ${client?.firstname}`;
  }

  getArticle(id: string): string {
    const client = this.articlesList().find((article) => article.id === id);
    return client?.label || '';
  }
}
