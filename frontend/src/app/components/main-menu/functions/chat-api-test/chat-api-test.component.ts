import { Component, OnInit } from '@angular/core';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

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
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messageList.push(message);
    })
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
}
