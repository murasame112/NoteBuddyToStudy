import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { NotesService } from '../../../../../services/notes.service';
import { Note } from 'src/app/models/note.model';
import { NoteAndDetails } from 'src/app/models/noteAndDetails.model';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { take, takeUntil } from 'rxjs';
import { FinalNote } from 'src/app/models/finalNote.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.scss'],
})
export class NotesContainerComponent extends Unsubscribe implements OnInit {
  // @Input() data: Note | null = null;
  // @Input() notesAndDetails: NoteAndDetails[] | null = null;
  @Input() finalNote: FinalNote | null = null;
  @Input() userRole: string | undefined = undefined;
  @Input() userId: string | undefined = undefined;
  @Input() userFavNotes: Array<string> | undefined = undefined;
  @Output() public deleteNoteEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() removeFromFavorites: EventEmitter<string> = new EventEmitter();

  isVisible: boolean = false;
  categoryName: string | undefined = this.finalNote?.categoryName;
  subCategoryName: string = '';
  userName: string = '';
  htmlText: any = '';
  isFilled = false;

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

  //? wyswietlanie zaznaczonej gwiazdy gdy notatka jest w ulu usera

  //! To do wywalenia do notes nie ma po co uruchamiać się tyle razy ile jest notatek
}
