import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
declare let google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

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

  //zamienia polskie znaki
  replacePolishChars(value: string) {
    const polishChars: any = {
      ą: 'a',
      ć: 'c',
      ę: 'e',
      ł: 'l',
      ń: 'n',
      ó: 'o',
      ś: 's',
      ź: 'z',
      ż: 'z',
    };

    return value.replace(
      /[ąćęłńóśźż]/g,
      (match) => polishChars[match] || match
    );
  }

  googleToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    const userName: string = this.replacePolishChars(decodedToken.given_name);
    const userFamilyName: string = this.replacePolishChars(
      decodedToken.family_name
    );

    const login: string =
      userName.charAt(0).toLowerCase() + userFamilyName.toLowerCase();

    let userData = {
      login: login,
      email: decodedToken.email,
    };

    return userData;
  }

  loginGoogleUser(loginData: any): Observable<string> {
    const url = `${this.apiUrl}/logingoogle`;
    return this.http.post(url, loginData, { responseType: 'text' });
  }

  //czysci localStorage
  logout() {
    localStorage.clear();
    this.currentUserSignal.set(null);
    google.accounts.id.disableAutoSelect();
    this.router.navigateByUrl('/login');
  }

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

  getUserToken(token: string) {
    const [headerBase64, payloadBase64, signature] = token.split('.');

    const header = JSON.parse(atob(headerBase64));
    const payload = JSON.parse(atob(payloadBase64));

    return payload;
  }
}
