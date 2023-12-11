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

  //Dodawanie kolekcji fiszek użytkownika do bazy
  addCardCollection(card: Card): Observable<Card> {
    const url = `${this.apiUrl}/card`;
    return this.http.post<Card>(url, card);
  }

  //Dodawanie fiszki do kolekcji użytkownika
  addCard(card: Card, cardId: string): Observable<Card> {
    const url = `${this.apiUrl}/card/${cardId}`;
    return this.http.patch<Card>(url, card);
  }

  //Pobieranie wszystkich kolekcji fiszek użytkowników
  getCards(): Observable<Card[]> {
    const url = `${this.apiUrl}/cards`;
    return this.http.get<Card[]>(url);
  }

  //Pobieranie kolekcji fiszek użytkowników po id kolekcji
  getCardById(id: string): Observable<Card> {
    const url = `${this.apiUrl}/card/${id}`;
    return this.http.get<Card>(url);
  }

  //Usuwanie fiszki użytkownika z kolekcji poprzez update kolekcji
  deleteCard(card: Card): Observable<Card> {
    const url = `${this.apiUrl}/card/${card._id}`;
    return this.http.put<Card>(url, card);
  }

  //Usuwanie kolekcji fiszek użytkownika w bazie
  deleteCardCollection(id: string): Observable<{}> {
    const url = `${this.apiUrl}/card/${id}`;
    return this.http.delete(url);
  }
}
