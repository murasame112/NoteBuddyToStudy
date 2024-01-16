import { Component, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { FinalNote } from 'src/app/models/finalNote.model';
import { UserRateNote } from 'src/app/models/userRateNote.model';
import { AuthService } from 'src/app/services/auth.service';
import { NotesService } from 'src/app/services/notes.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.scss'],
})
export class MyNotesComponent extends Unsubscribe implements OnInit {
  isLoading: Boolean = true;

  userId: string | undefined = undefined;
  myNotes: FinalNote[] = [];
  userSavedNotesIds: Array<string> = [];
  userNotesReviews: Array<UserRateNote> = [];

  ngOnInit(): void {
    this.userId = this.authService.currentUserSignal()?._id;

    this.getUserFavNotesIds();
    this.getUserNotesRates();

    this.getMyNotes();
  }

  constructor(
    public authService: AuthService,
    private notesService: NotesService,
    private usersService: UsersService
  ) {
    super();
  }

  getMyNotes() {
    this.notesService
      .getAllNoteData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (note) => {
          this.myNotes = note.filter(
            (n: FinalNote) => n.author_id === this.userId
          );
          this.isLoading = false;
        },
        (error) => {}
      );
  }

  getUserFavNotesIds() {
    if (this.userId) {
      this.usersService
        .getUserById(this.userId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (user) => {
            this.userSavedNotesIds = user.saved_notes;
          },
          (error) => {}
        );
    }
  }

  editNote() {}

  deleteNote(noteId: string) {
    this.notesService
      .deleteNote(noteId)
      .pipe(take(1))
      .subscribe(
        (res) => {},
        (error) => {}
      );

    this.myNotes = this.myNotes.filter((note) => note.note_id !== noteId);
  }

  getUserNotesRates() {
    if (this.userId) {
      this.notesService
        .getNotesRatesByUserId(this.userId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (userNotesRates) => {
            this.userNotesReviews = userNotesRates;
          },
          (error) => {}
        );
    }
  }
}
