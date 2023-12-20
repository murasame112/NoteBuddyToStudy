import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, delay, takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-show-note',
  templateUrl: './show-note.component.html',
  styleUrls: ['./show-note.component.scss'],
})
export class ShowNoteComponent extends Unsubscribe implements OnInit {
  constructor(
    private noteService: NotesService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService
  ) {
    super();
  }

  isLoading: Boolean = true;
  htmlText: any = '';

  ngOnInit(): void {
    let id: string = '';
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((param) => {
        id = param['id'];
      });
    this.getNote(id);
  }

  note!: Note;

  getNote(id: string) {
    this.noteService
      .getNoteById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.note = res;
          console.log(this.note);
          this.htmlText = this.note.content;
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
  }
}
