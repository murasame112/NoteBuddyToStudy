import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public apiUrl = 'http://localhost:3000';

  addUser(user: User): Observable<any> {
    const url = `${this.apiUrl}/user`;
    return this.http.post(url, user);
  }

  getUsers() {
    const url = `${this.apiUrl}/users`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const users = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            users.push({ ...response[key], id: key });
          }
        }
        return users;
      })
    );
  }

  getUserById(id: string) {
    const url = `${this.apiUrl}/user/${id}`;
    return this.http.get<string>(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getUsersByQuery(query: string, value: string): Observable<any> {
    const url = `${this.apiUrl}/users/${query}&${value}`;
    return this.http.get(url);
  }

  deleteUser(id: string) {
    const url = `${this.apiUrl}/user/${id}`;
    return this.http.delete<string>(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  loginUser(loginData: any): Observable<string> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, loginData, { responseType: 'text' });
  }
}
