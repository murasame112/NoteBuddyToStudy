import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";



@Injectable({
  providedIn: 'root',
})
export class ChatService {
	private socket;
	private users: any;
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {
		this.socket = io('http://localhost:3000');
		this.socket.onAny((event, ...args) => {
			console.log(event, args);
		});
		this.socket.auth = { username:"jd" };

		this.socket.on("users", (users) => {
			users.forEach((user: any) => {
				user.self = user.userID === this.socket.id;
				this.initReactiveProperties(user);
			});
			// put the current user first, and then sort by username
			this.users = users.sort((a:any, b:any) => {
				if (a.self) return -1;
				if (b.self) return 1;
				if (a.username < b.username) return -1;
				return a.username > b.username ? 1 : 0;
			});
		});
		
		this.socket.on("user connected", (user) => {
			this.initReactiveProperties(user);
			this.users.push(user);
		});
		console.log(this.users);
	}

	public initReactiveProperties = (user: any) => {
		user.hasNewMessages = false;
	};
 	

	


  public sendMessage(message: any) {
    console.log('sendMessage: ', message)
    this.socket.emit('message', message);
  }
	
	public getNewMessage = () => {
		return Observable.create((observer: any) => {
				this.socket.on('message', (message) => {
						observer.next(message);
				});
		});
	}

//   public getNewMessage = () => {
//     this.socket.on('message', (message) =>{
//       this.message$.next(message);
//     });

// 		this.socket.on('clients-total', (data) => {
// 			console.log(data);
// 		});

//     return this.message$.asObservable();
//   };
 }