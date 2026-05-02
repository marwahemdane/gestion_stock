import { inject, Injectable } from '@angular/core';
import { Database, ref, push, update, remove, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly db = inject(Database);

  getArticles(): Observable<any> {
    return new Observable((observer) => {
      const articlesRef = ref(this.db, 'articles');

      const unsubscribe = onValue(
        articlesRef,
        (snapshot) => {
          observer.next(snapshot.val());
        },
        (error) => {
          observer.error(error);
        },
      );

      return () => unsubscribe();
    });
  }

  addArticle(article: any) {
    const refArticles = ref(this.db, 'articles');
    return push(refArticles, article);
  }

  updateArticle(id: string, data: any) {
    const articleRef = ref(this.db, `articles/${id}`);
    return update(articleRef, data);
  }

  deleteArticle(id: string) {
    const articleRef = ref(this.db, `articles/${id}`);
    return remove(articleRef);
  }
}
