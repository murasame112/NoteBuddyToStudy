import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  private socket: any;
  private users: any;
  public apiUrl = 'http://localhost:3000';

  startSocket(groupId: string) {
    this.socket = io(this.apiUrl);

    let localStorageToken: string | null = localStorage.getItem('Token');

    this.socket.onAny((event: any, ...args: any) => {
      console.log(event, args);
    });

    this.socket.auth = {
      group_id: groupId,
      token: localStorageToken,
    };
  }

  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public getMessages = () => {
    return Observable.create((observer: any) => {
      this.socket.on('load_messages', (messages: any) => {
        observer.next(messages);
        observer.complete();
      });
    });
  };

  public getNewMessage = () => {
    return Observable.create((observer: any) => {
      this.socket.on('message', (message: any) => {
        observer.next(message);
      });
    });
  };

  addMessageToGroup(group_id: string, message: Message): Observable<Message> {
    const url = `${this.apiUrl}/addmessagetogroup/${group_id}`;
    return this.http.patch<Message>(url, message);
  }
}
