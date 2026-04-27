import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { USER_SESSION_KEY } from '../connexion/connexion';
import { ArticleService } from '../../services/article.service';

export type Article = {
  id: string;
  label: string;
  quantity: string;
};

@Component({
  selector: 'app-stock',
  templateUrl: 'stock.html',
  styleUrl: 'stock.css',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly articlesService = inject(ArticleService);

  user = signal<any>(null);
  displayedColumns: string[] = ['label', 'quantity', 'action'];
  dataSource = signal<Article[]>([]);
  form!: FormGroup;
  showAddForm = signal(false);
  showEditForm = signal(false);
  loading = signal(true);

  ngOnInit(): void {
    this.initForm();
    this.loadUser();
    this.loadArticles();
  }

  private initForm() {
    this.form = this.fb.group({
      id: [null],
      label: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  private loadUser() {
    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);
  }

  private loadArticles() {
    this.articlesService.getArticles().subscribe((res) => {
      if (res) {
        const data = Object.entries(res).map(([key, value]: any) => ({
          id: key,
          label: value.label,
          quantity: value.quantity,
        }));
        this.dataSource.set(data);
      } else {
        this.dataSource.set([]);
      }
      this.loading.set(false);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.showEditForm()) {
        this.articlesService.updateArticle(this.form.value.id, this.form.value);
      } else {
        this.articlesService.addArticle(this.form.value);
      }
      this.handleFormDisplay(false);
    }
  }

  handleFormDisplay(isVisisble: boolean) {
    this.showAddForm.set(isVisisble);
    if (!isVisisble) {
      this.showEditForm.set(false);
      this.form.reset({ quantity: 1 });
    }
  }

  editArticle(article: Article) {
    this.showEditForm.set(true);
    this.form.patchValue(article);
    this.showAddForm.set(true);
  }

  deleteArticle(article: Article) {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      this.articlesService.deleteArticle(article.id);
    }
  }
}
