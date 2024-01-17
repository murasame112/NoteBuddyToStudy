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

  //Dodawanie  fiszki użytkownika do bazy
  addCard(card: Card): Observable<Card> {
    const url = `${this.apiUrl}/card`;
    return this.http.post<Card>(url, card);
  }

  //Pobieranie wszystkich fiszek użytkowników
  getCards(): Observable<Card[]> {
    const url = `${this.apiUrl}/cards`;
    return this.http.get<Card[]>(url);
  }

  //Pobieranie fiszek użytkowników po id
  getCardById(id: string): Observable<Card> {
    const url = `${this.apiUrl}/card/${id}`;
    return this.http.get<Card>(url);
  }

  updateCategory(card: Card, card_id: string): Observable<Card> {
    const url = `${this.apiUrl}/card/${card_id}`;
    // return this.http.put<Card>(url, card);
    return this.http.patch<Card>(url, card);
  }

  //Usuwanie fiszek użytkownika w bazie
  deleteCard(id: string): Observable<{}> {
    const url = `${this.apiUrl}/card/${id}`;
    return this.http.delete(url);
  }
}
