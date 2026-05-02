import { Injectable } from '@angular/core';
import { Database, ref, set, push, update, remove, get, onValue } from '@angular/fire/database';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommandeService {
  constructor(private db: Database) {}

  saveMouvement(mouvement: any): Observable<any> {
    const mouvementsRef = ref(this.db, 'mouvements');
    return from(push(mouvementsRef, mouvement));
  }

  async createCommande(data: any) {
    const articleRef = ref(this.db, `articles/${data.article}`);
    const snap = await get(articleRef);
    const current = snap.val();

    if (current && current.quantity >= data.quantity) {
      const commandesRef = ref(this.db, 'commandes');
      const newCommandeRef = push(commandesRef);

      await set(newCommandeRef, data);

      await update(articleRef, {
        quantity: current.quantity - data.quantity,
      });

      const mouvementsRef = ref(this.db, 'mouvements');
      await push(mouvementsRef, {
        date: data.dateCommande,
        articleId: data.article,
        articleName: current.label,
        type: 'SORTIE',
        quantite: data.quantity,
        client: data.client,
      });

      return newCommandeRef;
    }

    return {
      error: '400',
      message: 'Stock insuffisant',
    };
  }

  getCommandes(): Observable<any> {
    return new Observable((observer) => {
      const commandesRef = ref(this.db, 'commandes');
      const unsubscribe = onValue(
        commandesRef,
        (snapshot) => observer.next(snapshot.val()),
        (error) => observer.error(error),
      );
      return () => unsubscribe();
    });
  }

  getMouvements(): Observable<any> {
    return new Observable((observer) => {
      const mouvementsRef = ref(this.db, 'mouvements');
      const unsubscribe = onValue(
        mouvementsRef,
        (snapshot) => observer.next(snapshot.val()),
        (error) => observer.error(error),
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
