import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError, of, takeUntil } from 'rxjs';
import { Unsubscribe } from './helpers/unsubscribe.class';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends Unsubscribe implements OnInit {
  title = 'frontend';
  authService = inject(AuthService);
  token: string | null = this.authService.getToken();

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (typeof this.token === 'string' && this.token !== '') {
      this.authService
        .isUserLogin()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (result) => {
            this.authService.currentUserSignal.set(result);
            // console.log(this.authService.currentUserSignal());
          },
          (err) => {
            // console.log(err);
            this.authService.currentUserSignal.set(null);
          }
        );
    } else {
      this.authService.currentUserSignal.set(null);
    }

    //!coś pokombinowac z tym login i register żeby dzialalo
  }
}
