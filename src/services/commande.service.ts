import { Injectable } from '@angular/core';
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
export class CommandeService {
  constructor(private db: Database) {}

  async createCommande(data: any) {
    const commandesRef = ref(this.db, 'commandes');
    const newCommande = push(commandesRef);

    // 1. sauvegarde commande
    await set(newCommande, data);

    // 2. mise à jour stock
    for (const article of data.articles) {
      const articleRef = ref(this.db, `articles/${article.id}`);

      const snap = await get(articleRef);
      const current = snap.val();

      await update(articleRef, {
        quantity: current.quantity - article.quantity,
      });
    }

    return newCommande;
  }

  getCommandes(): Observable<any> {
    return new Observable((observer) => {
      const commandesRef = ref(this.db, 'commandes');

      const unsubscribe = onValue(
        commandesRef,
        (snapshot) => {
          observer.next(snapshot.val());
        },
        (error) => {
          observer.error(error);
        },
      );

      // cleanup (important 🔥)
      return () => unsubscribe();
    });
  }
}
