import { Injectable } from '@angular/core';
import { Database, ref, set, push, update, remove, get, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommandeService {
  constructor(private db: Database) {}

  async createCommande(data: any) {
    const articleRef = ref(this.db, `articles/${data.article}`);

    const snap = await get(articleRef);
    const current = snap.val();

    if (current && current.quantity >= data.quantity) {
      const commandesRef = ref(this.db, 'commandes');
      const newCommande = push(commandesRef);

      await set(newCommande, data);

      await update(articleRef, {
        quantity: current.quantity - data.quantity,
      });

      const mouvementsRef = ref(this.db, 'mouvements');
      await push(mouvementsRef, {
        date: data.dateCommande,
        articleId: data.article,
        articleLabel: current.label || current.labelle || 'Article',
        type: 'SORTIE',
        quantite: data.quantity,
        client: data.client,
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
      return () => unsubscribe();
    });
  }

  getMouvements(): Observable<any> {
    return new Observable((observer) => {
      const mouvementsRef = ref(this.db, 'mouvements');
      const unsubscribe = onValue(
        mouvementsRef,
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

  async deleteCommande(id: string) {
    const commandeRef = ref(this.db, `commandes/${id}`);
    return remove(commandeRef);
  }

  async updateCommande(id: string, data: any) {
    const commandeRef = ref(this.db, `commandes/${id}`);
    return update(commandeRef, data);
  }
}
