import { Component, Input, LOCALE_ID } from '@angular/core';
import * as moment from 'moment';
import { Message } from 'src/app/models/message.model';
import '@angular/common/locales/global/pl';

@Component({
  selector: 'app-message-model',
  templateUrl: './message-model.component.html',
  styleUrls: ['./message-model.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'pl' }],
})
export class MessageModelComponent {
  @Input() messageData: Message | null = null;
  @Input() userAvatar: any | null = null;
  @Input() currUserLogin: any | null = null;

  showDate: boolean = false;

  showMessageDate() {
    this.showDate = !this.showDate;
  }
}
