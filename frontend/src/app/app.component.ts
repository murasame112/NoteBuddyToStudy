import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from './helpers/unsubscribe.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends Unsubscribe implements OnInit {
  title = 'frontend';
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService
      .isUserLogin()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        console.log('Sprawdzanie /extract w AppComponent', result);
        this.authService.currentUserSignal.set(result);
      });
  }
}
