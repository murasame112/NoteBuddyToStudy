import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { NotesService } from '../../../../../services/notes.service';
import { FinalNote } from 'src/app/models/finalNote.model';
import { Note } from 'src/app/models/note.model';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-admin-find-user-notes',
  templateUrl: './admin-find-user-notes.component.html',
  styleUrls: ['./admin-find-user-notes.component.scss'],
})
export class AdminFindUserNotesComponent extends Unsubscribe implements OnInit {
  constructor(private notesSerivice: NotesService) {
    super();
  }

  findUserNotesForm!: FormGroup;

  usersNotesOrigin: FinalNote[] = [];
  currentSearchedUserNotes: FinalNote[] = [];
  usersOrigin: User[] = [];

  //!
  notesDisplayedForUser: FinalNote[] = [];
  itemsPerPage = 3;
  currentPage = 0;
  maxPage!: number;
  //!
  ngOnInit(): void {
    this.getUsersNotes();
    this.getData();

    this.findUserNotesForm = new FormGroup({
      userName: new FormControl(''),
    });

    //!

    this.maxPage =
      Math.ceil(this.currentSearchedUserNotes.length / this.itemsPerPage) - 1;
    this.updateDisplayedNotes();
    //!
  }

  //Pobieranie wszystkich tablic z bazy danych dotyczacych notatek
  getData() {
    this.notesSerivice
      .getAllData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        // console.log(data);
        // this.notesOrigin = data[0];
        // this.categoryOrigin = data[1];
        // this.subcategoryOrigin = data[2];
        this.usersOrigin = data[3];
      });
  }

  getUsersNotes() {
    this.notesSerivice
      .getAllNoteData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        // console.log('res', res);
        this.usersNotesOrigin = res;
      });
  }

  searchNotes() {
    let userName = this.findUserNotesForm.get('userName')?.value;
    this.currentSearchedUserNotes = [];

    if (this.usersNotesOrigin.length != 0 && userName != '') {
      this.usersNotesOrigin.forEach((note) => {
        if (note.login.toLocaleLowerCase() === userName.toLocaleLowerCase()) {
          // console.log(note);
          this.currentSearchedUserNotes.push(note);
        }
      });
    } else {
    }

    // console.log(this.currentSearchedUserNotes);
    this.currentPage = 0;
    this.maxPage =
      Math.ceil(this.currentSearchedUserNotes.length / this.itemsPerPage) - 1;
    this.updateDisplayedNotes();
  }

  //!
  updateDisplayedNotes() {
    const startIndex = this.currentPage * this.itemsPerPage;
    this.notesDisplayedForUser = this.currentSearchedUserNotes.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
    // console.log(
    //   `current page${this.currentPage} of ${this.maxPage}`,
    //   this.notesDisplayedForUser
    // );
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
      this.updateDisplayedNotes();
    }
    // console.log('click next page');
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedNotes();
    }
    // console.log('click prev page');
  }

  refreshNoteData() {
    this.notesSerivice
      .getAllNoteData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.usersNotesOrigin = res;
        this.searchNotes();
      });
  }

  //!
}
