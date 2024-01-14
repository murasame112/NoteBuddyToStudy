import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket;
  private users: any;
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {
    // ponizej (chyba xd) polaczenie z serwerem
    this.socket = io('http://localhost:3000');

    // ponizej łapanie i console.logowanie nietypowych eventow, ponoc ma byc przydatne przy debugowaniu, raczej do wywalenia w przyszlosci
    this.socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    let tkn = localStorage.getItem('Token');
    // to ponizej jest do wyjebania zasadniczo, po prostu statycznie przypisywałem group_id zeby sprawdzić czy pokoje działają
    let group_id = '65a172294e20d5790e558469';
    if (
      tkn ==
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImZ1bm55bWFuIiwicGFzc3dvcmQiOiJGdW5ueW1hbjEhIiwiaWF0IjoxNzA0ODIyOTYzfQ.ujuRIuxJ8XOjqAjjHqAZvte6BTFtd3upvB0rbFZSUMI'
    ) {
      group_id = '65942be592d70a3c9d379ad1';
    }

    //tu powinien byc przysylany token z ciasteczek oraz id grupy którą otworzył sobie dany user
    this.socket.auth = {
      group_id: group_id,
      token: tkn,
    };

    // TEGO PONIZEJ NIE UZYWAMY, ALE ZOSTAWIAM BO SIE MOZE PRZYDA. Z TEGO CO WIEM TO PO PROSTU ZBIERA USEROW DO TABLICY ZEBY MOZNA BYLO ICH NP. WYSWIETLIC
    // this.socket.on("users", (users) => {
    // 	users.forEach((user: any) => {
    // 		user.self = user.userID === this.socket.id;
    // 		this.initReactiveProperties(user);
    // 	});
    // 	// put the current user first, and then sort by username
    // 	this.users = users.sort((a:any, b:any) => {
    // 		if (a.self) return -1;
    // 		if (b.self) return 1;
    // 		if (a.username < b.username) return -1;
    // 		return a.username > b.username ? 1 : 0;
    // 	});
    // });

    // this.socket.on("user connected", (user) => {
    // 	this.initReactiveProperties(user);
    // 	this.users.push(user);
    // });
    // console.log(this.users);
  }

  // public initReactiveProperties = (user: any) => {
  // 	user.hasNewMessages = false;
  // };

  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public getMessages = () => {
    return Observable.create((observer: any) => {
      this.socket.on('load_messages', (messages) => {
        observer.next(messages);
        observer.complete();
      });
    });
  };

  public getNewMessage = () => {
    return Observable.create((observer: any) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  };
}
