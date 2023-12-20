import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Hint } from 'src/app/models/hint.model';
import { AuthService } from 'src/app/services/auth.service';
import { HintsService } from 'src/app/services/hints.service';

@Component({
  selector: 'app-hints',
  templateUrl: './hints.component.html',
  styleUrls: ['./hints.component.scss'],
})
export class HintsComponent extends Unsubscribe implements OnInit {
  isLoading: Boolean = true;
  hintsOrigin: Hint[] = [];

  ngOnInit(): void {
    this.getHints();
  }

  constructor(
    private hintsService: HintsService,
    public authService: AuthService
  ) {
    super();
  }

  getHints() {
    this.hintsService
      .getHint()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((hints) => {
        // console.log('Hints:', hints);
        this.hintsOrigin = hints;
        this.isLoading = false;
      });
  }
}
