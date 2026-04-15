import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { USER_SESSION_KEY } from '../connexion/connexion';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ArticleService } from '../../services/article.service';
import { MatTooltipModule } from '@angular/material/tooltip';

export type Article = {
  id: string;
  label: string;
  quantity: string;
};

@Component({
  templateUrl: 'stock.html',
  styleUrl: 'stock.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
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
    this.form = this.fb.group({
      id: [null],
      label: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    const isUserConnected = localStorage.getItem(USER_SESSION_KEY);
    this.user.set(isUserConnected ? JSON.parse(isUserConnected) : null);

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
    if (isVisisble) {
      this.showAddForm.set(true);
    } else {
      this.showAddForm.set(false);
      this.showEditForm.set(false);

      this.form.reset();
    }
  }

  editArticle(article: Article) {
    this.showEditForm.set(true);
    this.form.setValue(article);
    this.handleFormDisplay(true);
  }

  deleteArticle(article: Article) {
    this.articlesService.deleteArticle(article.id);
  }
}
