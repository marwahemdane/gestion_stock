import { inject, Injectable } from '@angular/core';
import {
  Database,
  ref,
  set,
  push,
  update,
  remove,
  get,
  onValue,
  query,
  orderByChild,
  equalTo,
} from '@angular/fire/database';
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
    const newRef = push(refArticles);
    return set(newRef, article);
  }

  updateArticle(id: string, data: any) {
    return update(ref(this.db, `articles/${id}`), data);
  }

  deleteArticle(id: string) {
    return remove(ref(this.db, `articles/${id}`));
  }
}
