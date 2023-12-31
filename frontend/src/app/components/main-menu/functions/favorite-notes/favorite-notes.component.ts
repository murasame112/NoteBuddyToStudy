import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { FinalNote } from 'src/app/models/finalNote.model';
import { AuthService } from 'src/app/services/auth.service';
import { NotesService } from 'src/app/services/notes.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-favorite-notes',
  templateUrl: './favorite-notes.component.html',
  styleUrls: ['./favorite-notes.component.scss'],
})
export class FavoriteNotesComponent extends Unsubscribe implements OnInit {
  isLoading: Boolean = true;

  currentUserId: string | undefined = this.authService.currentUserSignal()?._id;
  userSavedNotesIds: Array<string> = [];
  notes: FinalNote[] = [];

  constructor(
    public authService: AuthService,
    private notesService: NotesService,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getUserFavNotesIds();
    this.getNotes();
  }

  getUserFavNotesIds() {
    if (this.currentUserId) {
      this.usersService
        .getUserById(this.currentUserId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (user) => {
            this.userSavedNotesIds = user.saved_notes;
          },
          (error) => {}
        );
    }
  }

  getNotes() {
    this.notesService
      .getAllNoteData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((notesRes) => {
        // this.notes = notesRes;
        this.notes = notesRes.filter((note) =>
          this.userSavedNotesIds.includes(note.note_id)
        );
        this.isLoading = false;
      });
  }

  removeFromFavorites(noteId: string) {
    this.notes = this.notes.filter((note: any) => note.note_id !== noteId);
    this.userSavedNotesIds = this.userSavedNotesIds.filter(
      (id) => id !== noteId
    );
  }
}
