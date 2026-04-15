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
    // 1. vérification de stock
    const articleRef = ref(this.db, `articles/${data.article}`);

    const snap = await get(articleRef);
    const current = snap.val();

    if (current.quantity > data.quantity) {
      const commandesRef = ref(this.db, 'commandes');
      const newCommande = push(commandesRef);

      // 2. sauvegarde commande
      await set(newCommande, data);

      // 3. mise à jour stock

      await update(articleRef, {
        quantity: current.quantity - data.quantity,
      });

      return newCommande;
    }

    return {
      error: '400',
      message: 'stock non suffisant',
    };
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
