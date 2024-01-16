import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, delay, takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-note',
  templateUrl: './show-note.component.html',
  styleUrls: ['./show-note.component.scss'],
})
export class ShowNoteComponent extends Unsubscribe implements OnInit {
  constructor(
    private noteService: NotesService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private location: Location
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
          this.htmlText = this.note.content;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  back() {
    this.location.back();
  }
}
