import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";



@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {}
/*
    const cloneRequest = request.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return next.handle(cloneRequest);
  }
*/
  socket = io('http://localhost:3000');

  public sendMessage(message: any) {
    console.log('sendMessage: ', message)
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}