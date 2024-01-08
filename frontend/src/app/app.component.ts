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

  constructor(private location: Location) {
    super();
  }

  ngOnInit(): void {
    let path = this.location.path();

    if (path === '/login' || path === '/register') {
      this.authService.currentUserSignal.set(null);
    } else {
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
    }
  }
}
