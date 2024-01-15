import { Component, Input } from '@angular/core';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-message-model',
  templateUrl: './message-model.component.html',
  styleUrls: ['./message-model.component.scss'],
})
export class MessageModelComponent {
  @Input() messageData: Message | null = null;
}
