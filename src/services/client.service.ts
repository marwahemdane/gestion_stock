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
  list,
} from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private db: Database) {}

  getClients(): Observable<any> {
    return new Observable((observer) => {
      const clientsRef = ref(this.db, 'clients');

      const unsubscribe = onValue(
        clientsRef,
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

  addClient(client: any) {
    const refClients = ref(this.db, 'clients');
    const newRef = push(refClients);
    return set(newRef, client);
  }

  updateClient(id: string, data: any) {
    return update(ref(this.db, `clients/${id}`), data);
  }

  deleteClient(id: string) {
    return remove(ref(this.db, `clients/${id}`));
  }
}
