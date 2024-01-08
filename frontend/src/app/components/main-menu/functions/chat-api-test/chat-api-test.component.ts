import { Component, OnInit } from '@angular/core';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-api-test',
  templateUrl: './chat-api-test.component.html',
  styleUrls: ['./chat-api-test.component.scss'],
})
export class ChatApiTestComponent extends Unsubscribe implements OnInit {
  current_user = this.authService.currentUserSignal();

  constructor(private authService: AuthService) {
    super();
  }
  ngOnInit(): void {
    console.log('User: ', this.current_user);
  }
}
