import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  ElementRef,
} from '@angular/core';
import { NotesService } from '../../../../../services/notes.service';
import { Note } from 'src/app/models/note.model';
import { NoteAndDetails } from 'src/app/models/noteAndDetails.model';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { take, takeUntil } from 'rxjs';
import { FinalNote } from 'src/app/models/finalNote.model';
import { UsersService } from 'src/app/services/users.service';
import { UserRateNote } from 'src/app/models/userRateNote.model';
import { rateNote } from 'src/app/models/rateNote.model';

@Component({
  selector: 'app-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.scss'],
})
export class NotesContainerComponent extends Unsubscribe implements OnInit {
  @Input() finalNote: FinalNote | null = null;
  @Input() userRole: string | undefined = undefined;
  @Input() userId: string | undefined = undefined;
  @Input() userFavNotes: Array<string> | undefined = undefined;
  @Input() userNotesRates: Array<UserRateNote> | undefined = undefined;
  @Output() public deleteNoteEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() removeFromFavorites: EventEmitter<string> = new EventEmitter();

  isVisible: boolean = false;
  categoryName: string | undefined = this.finalNote?.categoryName;
  subCategoryName: string = '';
  userName: string = '';
  htmlText: any = '';
  isFilled: boolean = false;
  isNoteRateFilled: boolean = false;
  isNotePositiveRate: boolean = false;
  isNoteNegativeRate: boolean = false;

  constructor(
    private notesService: NotesService,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.htmlText = this.finalNote?.content;

    if (this.finalNote?.note_id !== undefined) {
      this.isFilled = (this.userFavNotes ?? []).includes(
        this.finalNote?.note_id
      );
    }

    this.checkIfNoteIsRated();

    // console.log(
    //   this.finalNote?.noteName,
    //   this.isNotePositiveRate,
    //   this.userNotesRates
    // );
  }

  getCategory(id: Object) {
    this.notesService
      .getCategoryById(id.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        // console.log(res)
        this.categoryName = res.name;
      })
      .toString();
  }

  getSubCategory(id: Object) {
    this.notesService
      .getSubCategoryById(id.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.subCategoryName = res.name;
      })
      .toString();
  }

  getUser(id: Object) {
    this.notesService
      .getUserById(id.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.userName = res.login;
        // this.untrustedUser = res.untrusted;
      })
      .toString();
  }

  hoverEventOn() {
    this.isVisible = true;
  }

  hoverEventOff() {
    // let icons:any = document.querySelectorAll('.icons');
    this.isVisible = false;
  }

  deleteNote(_id: any) {
    this.notesService
      .deleteNote(_id.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.deleteNoteEvent.emit();
      });
  }

  toogleStar() {
    this.isFilled = !this.isFilled;

    if (this.isFilled) {
      if (this.userId) {
        console.log('dodano do ulubionych');

        if (this.userId !== undefined) {
          this.usersService
            .getUserById(this.userId)
            .pipe(take(1))
            .subscribe(
              (user) => {
                const existingUserSavedNotes = new Set(user.saved_notes);

                existingUserSavedNotes.add(this.finalNote?.note_id);

                const updateUserSavedNotes: any[] = Array.from(
                  existingUserSavedNotes
                );

                this.userFavNotes = updateUserSavedNotes;

                let fieldValue = {
                  saved_notes: updateUserSavedNotes,
                };

                if (this.userId) {
                  this.usersService
                    .updateUserField(this.userId, fieldValue)
                    .pipe(take(1))
                    .subscribe(
                      (res) => {
                        console.log('Udalo sie fav notes', this.userFavNotes);
                      },
                      (error) => {
                        console.log('Nie udalo sie', error);
                      }
                    );
                }
              },
              (error) => {
                console.log('Nie udało się pobrać danych usera');
              }
            );
        }
      }
    } else {
      if (this.userId) {
        console.log('usunięto z ulubionych');

        this.removeFromFavorites.emit(this.finalNote?.note_id);

        if (this.userId !== undefined) {
          this.usersService
            .getUserById(this.userId)
            .pipe(take(1))
            .subscribe(
              (user) => {
                const existingUserSavedNotes = new Set(user.saved_notes);

                existingUserSavedNotes.delete(this.finalNote?.note_id);

                const updateUserSavedNotes: any[] = Array.from(
                  existingUserSavedNotes
                );

                this.userFavNotes = updateUserSavedNotes;

                let fieldValue = {
                  saved_notes: updateUserSavedNotes,
                };

                if (this.userId) {
                  this.usersService
                    .updateUserField(this.userId, fieldValue)
                    .pipe(take(1))
                    .subscribe(
                      (res) => {
                        console.log('Udalo się fav notes', this.userFavNotes);
                      },
                      (error) => {
                        console.log('Nie udało się', error);
                      }
                    );
                }
              },
              (error) => {
                console.log('Nie udało się pobrać danych usera');
              }
            );
        }
      }
    }
  }
  //

  checkIfNoteIsRated() {
    if (this.userNotesRates && this.finalNote?.note_id) {
      this.isNoteRateFilled = this.userNotesRates.some(
        (rate) => rate.note_id === this.finalNote?.note_id
      );

      if (this.isNoteRateFilled) {
        const noteRate = this.userNotesRates.find(
          (rate) => rate.note_id === this.finalNote?.note_id
        );

        if (noteRate) {
          if (noteRate.rate === 'positive') {
            this.isNotePositiveRate = true;
            this.isNoteNegativeRate = false;
          } else if (noteRate.rate === 'negative') {
            this.isNotePositiveRate = false;
            this.isNoteNegativeRate = true;
          }

          //how user rate note
        }

        //does user rate note
      }
    }
  }

  //TODO NEED API FIX then apply endpoint to change rate

  ratePositive() {
    this.isNoteRateFilled = !this.isNoteRateFilled;
    this.isNotePositiveRate = !this.isNotePositiveRate;

    if (this.isNoteNegativeRate && this.finalNote) {
      this.finalNote!.negative_reviews = this.finalNote?.negative_reviews - 1;
      this.isNoteNegativeRate = false;
    }

    if (this.isNotePositiveRate && this.finalNote) {
      this.finalNote!.positive_reviews = this.finalNote?.positive_reviews + 1;

      const isExistingRate = this.userNotesRates?.find(
        (rate) => rate.note_id === this.finalNote?.note_id
      );

      if (isExistingRate) {
        isExistingRate.rate = 'positive';
        //array edited
      } else {
        if (this.finalNote) {
          this.userNotesRates?.push({
            note_id: this.finalNote?.note_id,
            rate: 'positive',
          });
        }

        //push to array
      }
    } else if (!this.isNotePositiveRate && this.finalNote) {
      this.finalNote!.positive_reviews = this.finalNote?.positive_reviews - 1;

      const existingNoteIndex = this.userNotesRates?.findIndex(
        (rate) => rate.note_id === this.finalNote?.note_id
      );

      if (existingNoteIndex !== undefined && existingNoteIndex !== -1) {
        //delete from table because user unlike note
        this.userNotesRates?.splice(existingNoteIndex, 1);
      }
    }

    // if (this.userId && this.finalNote?.note_id) {
    //   let noteRate: rateNote = {
    //     user_id: this.userId,
    //     rate: 'positive',
    //   };

    //   this.notesService
    //     .rateNote(noteRate, this.finalNote?.note_id)
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe(
    //       (res) => {
    //         console.log(res);
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //     );
    // }

    console.log('userRateArrayPos', this.userNotesRates);
  }

  rateNegative() {
    this.isNoteRateFilled = !this.isNoteRateFilled;
    this.isNoteNegativeRate = !this.isNoteNegativeRate;

    if (this.isNotePositiveRate && this.finalNote) {
      this.finalNote!.positive_reviews = this.finalNote?.positive_reviews - 1;
      this.isNotePositiveRate = false;
    }

    if (this.isNoteNegativeRate && this.finalNote) {
      this.finalNote!.negative_reviews = this.finalNote?.negative_reviews + 1;

      const isExistingRate = this.userNotesRates?.find(
        (rate) => rate.note_id === this.finalNote?.note_id
      );

      if (isExistingRate) {
        isExistingRate.rate = 'negative';
        //edited
      } else {
        if (this.finalNote) {
          this.userNotesRates?.push({
            note_id: this.finalNote?.note_id,
            rate: 'negative',
          });
        }

        //push to array
      }
    } else if (!this.isNoteNegativeRate && this.finalNote) {
      this.finalNote!.negative_reviews = this.finalNote?.negative_reviews - 1;

      const existingRateIndex = this.userNotesRates?.findIndex(
        (rate) => rate.note_id === this.finalNote?.note_id
      );

      if (existingRateIndex !== undefined && existingRateIndex !== -1) {
        this.userNotesRates?.splice(existingRateIndex, 1);
      }
    }

    // if (this.userId && this.finalNote?.note_id) {
    //   let noteRate: rateNote = {
    //     user_id: this.userId,
    //     rate: 'negative',
    //   };

    //   this.notesService
    //     .rateNote(noteRate, this.finalNote?.note_id)
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe(
    //       (res) => {
    //         console.log(res);
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //     );
    // }

    console.log('actualRateArrayNeg', this.userNotesRates);
  }
}
