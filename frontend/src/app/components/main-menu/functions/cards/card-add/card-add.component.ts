import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { CardsService } from 'src/app/services/cards.service';
import { Card } from 'src/app/models/card.model';

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss'],
})
export class CardAddComponent extends Unsubscribe implements OnInit {
  addCardForm!: FormGroup;
  noteId: string = '';
  cardsOrigin: Card[] = [];

  //example ArthasMenethil
  userId: string = '6571f1194eb34b255210866e';
  //sarahKerrigan ma fiszki
  // userId: string = '65328d32a6bc723aa7284771';

  constructor(
    private cardService: CardsService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.addCardForm = new FormGroup({
      cardText: new FormControl('', Validators.required),
      cardAnswer: new FormControl('', Validators.required),
    });

    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((param) => {
        this.noteId = param['id'];
      });

    this.getCards(this.noteId);
  }

  getCards(noteId: string) {
    this.cardService
      .getCards()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cards) => {
        this.cardsOrigin = cards.filter((card) => {
          if (card.note_id === noteId && card.author_id === this.userId) {
            return card;
          }
          return false;
        });
        this.checkIfUserHasCollection();
        console.log('fiszki do tej notatki:', this.cardsOrigin);
      });
  }

  checkIfUserHasCollection() {
    if (this.cardsOrigin.length === 0) {
      console.log(
        'Ten użytkownik musi mieć najpierw stworzoną kolekcje fiszek'
      );
      this.addCardCollection();
    } else {
      console.log(
        'Ten użytkownik ma już kolekcje więc musimy zrobic update jego kolekcji'
      );
    }
  }

  addCardCollection() {
    let newCardCollection: Card = {
      questions: [],
      answers: [],
      note_id: this.noteId,
      author_id: this.userId,
      published: false,
    };

    this.cardService
      .addCard(newCardCollection)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cardCollection) => {
        console.log('CardCollectionId:', cardCollection);
        console.log('Pobieranie kolekcji fiszek...');
        this.getCards(this.noteId);
      });
  }

  addCard(data: any) {}
}
