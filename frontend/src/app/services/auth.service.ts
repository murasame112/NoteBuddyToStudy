import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  loginUser(loginData: any): Observable<string> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, loginData, { responseType: 'text' });
  }

  getToken() {
    return localStorage.getItem('Token');
  }

  logout() {
    localStorage.clear();
  }

  //! Tylko chwilowo
  showUsername() {
    const token = this.getToken() ?? '';

    const [headerBase64, payloadBase64, signature] = token.split('.');

    const header = JSON.parse(atob(headerBase64));
    const payload = JSON.parse(atob(payloadBase64));

    return payload.login;
  }

  getUserPass() {
    const token = this.getToken() ?? '';

    const [headerBase64, payloadBase64, signature] = token.split('.');

    const header = JSON.parse(atob(headerBase64));
    const payload = JSON.parse(atob(payloadBase64));

    return payload.password;
  }

  //!
}
