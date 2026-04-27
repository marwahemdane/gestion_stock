import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mouvement {
  id?: string;
  articleLabel: string;
  type: 'ENTREE' | 'SORTIE';
  quantity: number;
  reason: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class MouvementService {
  private http = inject(HttpClient);

  private readonly DB_URL = 'https://ton-projet-default-rtdb.firebaseio.com/mouvements.json';

  getMouvements(): Observable<any> {
    return this.http.get<any>(this.DB_URL);
  }

  enregistrerMouvement(mouvement: Mouvement): Observable<any> {
    return this.http.post<any>(this.DB_URL, mouvement);
  }
}
