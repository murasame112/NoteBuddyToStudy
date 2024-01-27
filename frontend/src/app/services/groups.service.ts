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

  //Send array of users without user who leave group
  deleteUserFromGroup(groupId: string, users: any): Observable<any> {
    const url = `${this.apiUrl}/group/${groupId}`;
    return this.http.patch<any>(url, users);
  }

  getGroupById(groupId: string): Observable<any> {
    const url = `${this.apiUrl}/group/${groupId}`;
    return this.http.get<any>(url);
  }
}
