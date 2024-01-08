import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { CardsService } from 'src/app/services/cards.service';
import { Card } from 'src/app/models/card.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss'],
})
export class CardAddComponent extends Unsubscribe implements OnInit {
  addCardForm!: FormGroup;
  noteId: string = '';

  userId: string | undefined = '';

  constructor(
    private cardService: CardsService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.userId = this.authService.currentUserSignal()?._id;

    this.addCardForm = new FormGroup({
      cardText: new FormControl('', Validators.required),
      cardAnswer: new FormControl('', Validators.required),
    });

    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((param) => {
        this.noteId = param['id'];
      });
  }

  addCard(data: any) {
    if (this.addCardForm.valid) {
      if (this.userId) {
        let newCard: Card = {
          question: data.cardText,
          answer: data.cardAnswer,
          note_id: this.noteId,
          author_id: this.userId,
        };

        this.cardService
          .addCard(newCard)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((res) => {
            this.router.navigateByUrl(`/cards/${this.noteId}`);
            setTimeout(() => {}, 1000);
          });
      }
    } else {
      alert('Wszystkie pola formularza muszą byc wypełnione');
    }
  }
}
