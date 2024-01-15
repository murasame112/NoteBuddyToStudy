import { Component, Input } from '@angular/core';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-message-model',
  templateUrl: './message-model.component.html',
  styleUrls: ['./message-model.component.scss'],
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
