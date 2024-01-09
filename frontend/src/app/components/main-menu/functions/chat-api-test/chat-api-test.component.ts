import { Component, OnInit } from '@angular/core';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import * as moment from 'moment';
import { from } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { skipWhile } from 'rxjs/operators';
import { scan } from 'rxjs/operators';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-chat-api-test',
  templateUrl: './chat-api-test.component.html',
  styleUrls: ['./chat-api-test.component.scss'],
})
export class ChatApiTestComponent extends Unsubscribe implements OnInit {
  current_user = this.authService.currentUserSignal();
  newMessage = '';
  messageList: string[] = [];
  constructor(private authService: AuthService, private chatService: ChatService) {
    super();
  }
	
	ngOnInit(){
    this.chatService
		.getNewMessage()
		.pipe(
		distinctUntilChanged(),
		filter((message: any) => message.trim().length > 0),
		throttleTime(1000)
		)
		
		.subscribe((message: string) => {
			const currentTime = moment().format('hh:mm:ss a');
			const messageWithTimestamp = `${currentTime}: ${message}`;
      this.messageList.push(messageWithTimestamp);
    })


		

  }
	

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
}
