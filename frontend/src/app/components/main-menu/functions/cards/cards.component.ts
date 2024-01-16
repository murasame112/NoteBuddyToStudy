import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Card } from 'src/app/models/card.model';
import { CardsToShow } from 'src/app/models/cardToShow.model';
import { Note } from 'src/app/models/note.model';
import { AuthService } from 'src/app/services/auth.service';
import { CardsService } from 'src/app/services/cards.service';
import { NotesService } from 'src/app/services/notes.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent extends Unsubscribe implements OnInit {
  noteId: string = '';
  selectedNote: Note = {
    _id: '',
    name: '',
    author_id: '',
    category_id: '',
    subcategory_id: '',
  };

  //Orginalna tablica z wszystkimi fiszkami z kolekcji
  cardsOrigin: Card[] = [];
  //zmienione fiszki tak aby mogly zostać poprawnie wyswietlone na stronie
  cardsToShow: CardsToShow[] = [];
  isLoading: boolean = true;
  userId: string | undefined = '';
  //fiszki które naleza do użytkownika
  userCards: Card[] = [];

  //! wyswietlanie obecnie ustawionej fiszki na ekranie(tylko jedna na raz)
  cardDisplayedForUser!: CardsToShow;

  //stworzony indeks wyświetlanej fiszki
  currentCardToShowIndex: number = 0;

  //pokazywanie zakladki learnCards
  showLearnCardsContainer: boolean = false;
  //pokazywanie zakladki randomCards
  showRandomCardsContainer: boolean = false;
  //pokazywanie zakladki myCards
  showMyCardsContainer: boolean = false;

  //pokazywanie menu edycji określonej notatki
  showEditCardContainer: boolean = false;

  editCardForm!: FormGroup;

  constructor(
    private noteService: NotesService,
    private cardService: CardsService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((param) => {
        this.noteId = param['id'];
        this.getCards(this.noteId);
      });
    this.findNoteById(this.noteId);

    this.userId = this.authService.currentUserSignal()?._id;

    this.editCardForm = new FormGroup({
      cardText: new FormControl('', Validators.required),
      cardAnswer: new FormControl('', Validators.required),
    });
  }

  findNoteById(id: string) {
    this.noteService
      .getNoteById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((note: Note) => {
        this.selectedNote = {
          _id: id,
          name: note.name,
          author_id: note.author_id,
          category_id: note.category_id,
          subcategory_id: note.subcategory_id,
        };
      });
  }

  getCards(id: string) {
    this.cardService
      .getCards()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cards) => {
        this.cardsOrigin = cards.filter((card) => {
          return card.note_id === id;
        });
        this.transformToShowCards(this.cardsOrigin);
        this.updateCardToShow();
        this.isLoading = false;
      });
  }

  //transformowanie tablicy Origin aby wyświetlić pojedynczo dostępne dla uzytkownika fiszki
  transformToShowCards(cardsOrigin: Card[]) {
    cardsOrigin.forEach((card, index) => {
      const cards_id = `${index + 1}`;
      this.cardsToShow.push({
        card_id: cards_id,
        note_id: card.note_id,
        author_id: card.author_id,
        question: card.question,
        answer: card.answer,
      });
    });
  }

  showLearnCards() {
    this.showLearnCardsContainer = true;
    this.showRandomCardsContainer = false;
    this.showMyCardsContainer = false;

    this.currentCardToShowIndex = 0;
    this.updateCardToShow();
  }

  showRandomCards() {
    this.showRandomCardsContainer = true;
    this.showLearnCardsContainer = false;
    this.showMyCardsContainer = false;

    this.currentCardToShowIndex = 0;
    this.updateCardToShow();
  }

  // wyswietlanie fiszek po jednej
  previousCard() {
    if (this.currentCardToShowIndex > 0) {
      this.currentCardToShowIndex--;
    }

    this.updateCardToShow();
  }

  nextCard() {
    if (this.currentCardToShowIndex < this.cardsToShow.length - 1) {
      this.currentCardToShowIndex++;
    }

    this.updateCardToShow();
  }

  randomCard() {
    let randomIndex = this.currentCardToShowIndex;

    while (randomIndex === this.currentCardToShowIndex) {
      randomIndex = Math.floor(Math.random() * this.cardsToShow.length);
    }

    this.currentCardToShowIndex = randomIndex;
    this.updateCardToShow();
  }

  isRandomButtonDisabled() {
    return this.cardsToShow.length <= 1;
  }

  updateCardToShow() {
    const index = this.currentCardToShowIndex;
    this.cardDisplayedForUser = this.cardsToShow[index];
  }

  myCards() {
    this.showRandomCardsContainer = false;
    this.showLearnCardsContainer = false;
    this.showMyCardsContainer = true;

    this.userCards = this.cardsOrigin.filter((card) => {
      return card.author_id === this.userId;
    });
  }

  showEditCard(card: Card, index: number) {
    this.currentCardToShowIndex = index;
    this.showEditCardContainer = !this.showEditCardContainer;

    this.editCardForm.patchValue({
      cardText: card.question,
      cardAnswer: card.answer,
    });
  }

  editCard(data: any, card: Card) {
    if (this.editCardForm.valid && card._id) {
      let editCard: Card = {
        _id: card._id,
        question: data.cardText,
        answer: data.cardAnswer,
        note_id: card.note_id,
        author_id: card.author_id,
        last_edit_date: card.last_edit_date,
        published: card.published,
        shared_date: card.shared_date,
      };

      this.cardService
        .updateCategory(editCard, card._id)
        .pipe(take(1))
        .subscribe(
          (res) => {
            const index = this.userCards.findIndex((c) => c._id === card._id);
            if (index !== -1) {
              this.userCards[index] = editCard;
            }

            const indexO = this.cardsOrigin.findIndex(
              (c) => c._id === card._id
            );
            if (indexO !== -1) {
              this.cardsOrigin[indexO] = editCard;
            }

            this.cardsToShow = [];
            this.transformToShowCards(this.cardsOrigin);

            this.editCardForm.reset();
            this.showEditCardContainer = false;
          },
          (error) => {}
        );

      this.editCardForm.markAsPristine();
      this.editCardForm.markAsUntouched();
    } else {
      alert('Wszystkie pola formularza muszą być wypełnione');
    }
  }

  deleteCard(card_id: any) {
    const index = this.userCards.findIndex((c) => c._id === card_id);
    if (index !== -1) {
      this.userCards.splice(index, 1);
    }

    const indexO = this.cardsOrigin.findIndex((c) => c._id === card_id);
    if (indexO !== -1) {
      this.cardsOrigin.splice(indexO, 1);
    }

    this.cardsToShow = [];
    this.transformToShowCards(this.cardsOrigin);

    this.editCardForm.reset();
    this.showEditCardContainer = false;

    this.editCardForm.markAsPristine();
    this.editCardForm.markAsUntouched();

    this.cardService
      .deleteCard(card_id)
      .pipe(take(1))
      .subscribe(
        (res) => {},
        (error) => {}
      );
  }

  back() {
    this.location.back();
  }
}
