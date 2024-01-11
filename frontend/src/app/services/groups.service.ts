import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';
import { AddUserToGroup } from '../models/addUserToGroup.model';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private http: HttpClient) {}

  public apiUrl = 'http://localhost:3000';

  addUserToGroup(group: AddUserToGroup): Observable<AddUserToGroup> {
    const url = `${this.apiUrl}/addtogroup`;
    return this.http.patch<AddUserToGroup>(url, group);
  }

  getGroupsByUserId(userId: string): Observable<any> {
    const url = `${this.apiUrl}/groupsid/users&${userId}`;
    return this.http.get<any>(url);
  }

  // getHint(): Observable<Group[]> {
  //   const url = `${this.apiUrl}/hints`;
  //   return this.http.get<Group[]>(url);
  // }

  // getHintById(id: string): Observable<Group> {
  //   const url = `${this.apiUrl}/hint/${id}`;
  //   return this.http.get<Group>(url);
  // }

  // updateHint(hint: Group): Observable<Group> {
  //   const url = `${this.apiUrl}/hint/${hint._id}`;
  //   return this.http.put<Group>(url, hint);
  // }

  // deleteHint(id: string): Observable<{}> {
  //   const url = `${this.apiUrl}/hint/${id}`;
  //   return this.http.delete(url);
  // }
}
