import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Card } from 'src/app/models/card.model';
import { CardsToShow } from 'src/app/models/cardToShow.model';
import { Note } from 'src/app/models/note.model';
import { CardsService } from 'src/app/services/cards.service';
import { NotesService } from 'src/app/services/notes.service';

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
  //zmienone fiszki dostępne dla uzytkownika które mogą zostac wyswietlone na stronie
  cardsToShow: CardsToShow[] = [];
  isLoading: boolean = true;
  //example ArthasMenethil
  // userId: string = '6571f1194eb34b255210866e';
  //sarahKerrigan ma fiszki
  userId: string = '65328d32a6bc723aa7284771';
  //fiszki które naleza do użytkownika
  userCards: Card[] = [];
  //zmienione fiszki ktore naleza do  uzytkownika i moga zostać wyswietlone na stronie
  userCardsToShow: CardsToShow[] = [];

  //! wyswietlanie fiszek po jednej
  cardDisplayedForUser!: CardsToShow;
  currentCardToShowIndex: number = 0;

  showLearnCardsContainer: boolean = false;
  showRandomCardsContainer: boolean = false;
  showMyCardsContainer: boolean = false;

  constructor(
    private noteService: NotesService,
    private cardService: CardsService,
    private activatedRoute: ActivatedRoute
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
        console.log('Wybrana notatka:', this.selectedNote);
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
        console.log('Fiszki do tej notatki:', this.cardsOrigin);
        this.transformToShowCards(this.cardsOrigin);
        console.log('dostępne fiszki:', this.cardsToShow);
        this.updateCardToShow();
        this.isLoading = false;
      });
  }

  //transformowanie tablicy Origin aby wyświetlić dostępne dla uzytkownika fiszki
  transformToShowCards(cardsOrigin: Card[]) {
    cardsOrigin.forEach((card) => {
      card.questions.forEach((question, index) => {
        const card_id = `${index + 1}`;
        const answer = card.answers[index] || '';

        this.cardsToShow.push({
          card_id: card_id,
          note_id: card.note_id,
          author_id: card.author_id,
          question: question,
          answer: answer,
        });
      });
    });
  }

  // transformowanie tablicy userCards aby wyświetlić fiszki należace do uzytkownika
  transformUserCardsToShowCards(userCards: Card[]) {
    this.userCardsToShow = [];

    userCards.forEach((card) => {
      card.questions.forEach((question, index) => {
        const card_id = card._id;

        if (card_id) {
          const answer = card.answers[index] || '';

          this.userCardsToShow.push({
            card_id: card_id,
            note_id: card.note_id,
            author_id: card.author_id,
            question: question,
            answer: answer,
          });
        }
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

  //! wyswietlanie fiszek po jednej
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

  updateCardToShow() {
    const index = this.currentCardToShowIndex;
    this.cardDisplayedForUser = this.cardsToShow[index];
  }

  //!

  myCards() {
    this.showRandomCardsContainer = false;
    this.showLearnCardsContainer = false;
    this.showMyCardsContainer = true;

    this.userCards = this.cardsOrigin.filter((card) => {
      return card.author_id === this.userId;
    });

    if (this.userCards.length === 0) {
      console.log('dodajemy nową kolekcje dla fiszek tego użytkownika');
      this.transformUserCardsToShowCards(this.userCards);
      // this.transformToShowCards(this.userCards);
    } else {
      console.log(
        'ten użytkownik ma juz kolekcje fiszek więc robimy update jego kolekcji',
        this.userCards
      );
      this.transformUserCardsToShowCards(this.userCards);
      console.log(this.userCardsToShow);
    }
  }
}
