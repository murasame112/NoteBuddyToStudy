import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  //logowanie uzytkownika zwraca token lub false
  loginUser(loginData: any): Observable<string> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, loginData, { responseType: 'text' });
  }

  //sprawdza czy uzytkownik jest zalogowany
  isUserLogin(): Observable<User> {
    const url = `${this.apiUrl}/extract`;
    return this.http.get<User>(url);
  }

  //sygnał czy uzytkownik jest zalogowany "User" czy nie wiemy "undefined" lub nie jest "null"
  currentUserSignal = signal<User | undefined | null>(undefined);

  //zwraca token z localStorage
  getToken() {
    return localStorage.getItem('Token') || null;
  }

  //czysci localStorage
  logout() {
    localStorage.clear();
  }

  //! Tylko chwilowo

  getUserPass() {
    const token = this.getToken() ?? '';

    if (!token) {
      return null;
    }

    const [headerBase64, payloadBase64, signature] = token.split('.');

    const header = JSON.parse(atob(headerBase64));
    const payload = JSON.parse(atob(payloadBase64));

    return payload.password;
  }

  //!
}
