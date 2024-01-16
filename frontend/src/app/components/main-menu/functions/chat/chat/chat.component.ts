import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { take, throttleTime } from 'rxjs/operators';
import * as moment from 'moment';
import { GroupsService } from 'src/app/services/groups.service';
import { UsersService } from 'src/app/services/users.service';
import { GroupData } from 'src/app/models/groupData.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent extends Unsubscribe implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private chatService: ChatService,
    private usersService: UsersService
  ) {
    super();
  }

  groupId: string = '';
  currentUser: User | null | undefined = undefined;
  messages: Message[] = [];
  newMessage: string = '';

  //!
  usersData: GroupData[] = [];
  @ViewChild('chatInput') chatInput!: ElementRef;
  showChat: boolean = false;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (param) => {
        this.groupId = param['id'];
      },
      (error) => {}
    );

    this.currentUser = this.authService.currentUserSignal();
    console.log(this.groupId);

    this.getUsersData();

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
    this.chatInput.nativeElement.focus();
    console.log(currentTime);
  }

  getUsersData() {
    this.usersService
      .getUsersFromGroupId(this.groupId)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.usersData = res;
          console.log(this.usersData);
          this.showChat = true;
          this.isLoading = false;

          setTimeout(() => {
            this.scrollToInput();
          }, 500);
        },
        (error) => {}
      );
  }

  getUsersAvatars(login: string) {
    let userAvatar: GroupData | undefined = this.usersData.find(
      (user) => user.login === login
    );
    return userAvatar?.avatar_url;
  }

  scrollToInput() {
    this.chatInput.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.chatInput.nativeElement.focus();
  }
}
