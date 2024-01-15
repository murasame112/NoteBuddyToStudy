import { Component, OnInit } from '@angular/core';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { AuthService } from 'src/app/services/auth.service';
import { ChatTestService } from 'src/app/services/chatTest.service';
import * as moment from 'moment';
import { Message } from 'src/app/models/message.model';
import { from } from 'rxjs';
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { skipWhile } from 'rxjs/operators';
import { scan } from 'rxjs/operators';
import { throttleTime } from 'rxjs/operators';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-chat-api-test',
  templateUrl: './chat-api-test.component.html',
  styleUrls: ['./chat-api-test.component.scss'],
})
export class ChatApiTestComponent extends Unsubscribe implements OnInit {
  current_user = this.authService.currentUserSignal();
  newMessage = '';
  messageList: string[] = [];
  group_id = '65a411dd63da079d118b389b';
  user: string = '';

  list: Message[] = [];

  constructor(
    private authService: AuthService,
    private chatService: ChatTestService
  ) {
    super();
  }

  ngOnInit() {
    if (this.current_user) {
      this.user = this.current_user.login;
    }

    this.chatService.startSocket(this.group_id);
    // this.chatService.group_id = this.group_id;
    this.getMessages();
    this.getNewMessages();
  }

  getMessages() {
    this.chatService.getMessages().subscribe((messages: any[]) => {
      // let messageString = '';
      // messages.forEach((element: Message) => {
      //   let date = element.date.toLocaleString('en-GB');
      //   messageString = element.login + ': ' + element.content + ' - ' + date;
      //   console.log(element.login);
      //   this.messageList.push(messageString);
      //   messageString = '';
      // });
      this.list = messages;
      console.log(this.list);
    });
  }

  getNewMessages() {
    this.chatService
      .getNewMessage()
      .pipe(
        distinctUntilChanged(),
        // filter((message: any) => message.trim().length > 0),
        throttleTime(1000)
      )

      .subscribe((message: any) => {
        const currentTime = moment().format();
        const date = new Date(currentTime);
        const login = this.current_user ? this.current_user.login : '';
        const msg: Message = {
          ['login']: login,
          ['content']: message,
          ['date']: date,
        };
        // // tu endpoint patch /addmessagetogroup/:id, przy czym :id to group_id.
        // // w body będzie {"message" : msg};

        // console.log(msg);
        // this.chatService
        //   .addMessageToGroup(this.group_id, msg)
        //   .pipe(takeUntil(this.unsubscribe$))
        //   .subscribe(
        //     (res) => {
        //       console.log(res);
        //     },
        //     (error) => {
        //       console.log(error);
        //     }
        //   );

        // const messageWithTimestamp = `${date.toLocaleTimeString(
        //   'en-GB'
        // )}: ${message}`;
        // this.messageList.push(messageWithTimestamp);

        this.list.push(message);
        console.log(message);
      });
  }

  sendMessage() {
    const currentTime = moment().format();
    const time = new Date(currentTime);
    const login = this.current_user ? this.current_user.login : '';

    if (this.newMessage !== '') {
      let sendMessage: any = {
        message: {
          login: login,
          content: this.newMessage,
          date: time,
        },
      };

      this.chatService
        .addMessageToGroup(this.group_id, sendMessage)
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
