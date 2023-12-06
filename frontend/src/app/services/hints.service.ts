import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hint } from '../models/hint.model';

@Injectable({
  providedIn: 'root',
})
export class HintsService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  addHint(hint: Hint): Observable<Hint> {
    const url = `${this.apiUrl}/hint`;
    return this.http.post<Hint>(url, hint);
  }

  getHint(): Observable<Hint[]> {
    const url = `${this.apiUrl}/hints`;
    return this.http.get<Hint[]>(url);
  }

  getHintById(id: string): Observable<Hint> {
    const url = `${this.apiUrl}/hint/${id}`;
    return this.http.get<Hint>(url);
  }

  updateHint(hint: Hint): Observable<Hint> {
    const url = `${this.apiUrl}/hint/${hint._id}`;
    return this.http.put<Hint>(url, hint);
  }

  deleteHint(id: string): Observable<{}> {
    const url = `${this.apiUrl}/hint/${id}`;
    return this.http.delete(url);
  }
}
