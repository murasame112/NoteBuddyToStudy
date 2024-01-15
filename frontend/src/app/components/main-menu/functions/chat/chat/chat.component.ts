import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { take, throttleTime } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent extends Unsubscribe implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private chatService: ChatService
  ) {
    super();
  }

  groupId: string = '';
  currentUser: User | null | undefined = undefined;
  messages: Message[] = [];
  newMessage: string = '';

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (param) => {
        this.groupId = param['id'];
      },
      (error) => {}
    );

    this.currentUser = this.authService.currentUserSignal();
    console.log(this.groupId);

    this.chatService.startSocket(this.groupId);
    this.getMessages();
    this.getNewMessage();
  }

  getMessages() {
    this.chatService
      .getMessages()
      .pipe(takeUntil(this.unsubscribe$), throttleTime(1000))
      .subscribe(
        (mes: Message[]) => {
          this.messages = mes;
          console.log(this.messages);
        },
        (error: any) => {}
      );
  }

  getNewMessage() {
    this.chatService
      .getNewMessage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (message: Message) => {
          this.messages.push(message);
          console.log(message);
        },
        (error: any) => {}
      );
  }

  sendMessage() {
    const currentTime = moment().format();
    const time = new Date(currentTime);
    const login = this.currentUser?.login;

    if (this.newMessage !== '') {
      let sendMessage: any = {
        message: {
          login: login,
          content: this.newMessage,
          date: time,
        },
      };

      this.chatService
        .addMessageToGroup(this.groupId, sendMessage)
        .pipe(take(1))
        .subscribe(
          (res) => {
            console.log(res);
          },
          (error) => {}
        );

      this.chatService.sendMessage(sendMessage.message);
    }

    this.newMessage = '';
  }
}
