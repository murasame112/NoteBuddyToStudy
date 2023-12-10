import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  addCard(card: Card): Observable<Card> {
    const url = `${this.apiUrl}/card`;
    return this.http.post<Card>(url, card);
  }

  getCards(): Observable<Card[]> {
    const url = `${this.apiUrl}/cards`;
    return this.http.get<Card[]>(url);
  }

  getCardById(id: string): Observable<Card> {
    const url = `${this.apiUrl}/card/${id}`;
    return this.http.get<Card>(url);
  }

  updateCard(card: Card): Observable<Card> {
    const url = `${this.apiUrl}/card/${card._id}`;
    return this.http.put<Card>(url, card);
  }

  deleteCard(id: string): Observable<{}> {
    const url = `${this.apiUrl}/card/${id}`;
    return this.http.delete(url);
  }
}
