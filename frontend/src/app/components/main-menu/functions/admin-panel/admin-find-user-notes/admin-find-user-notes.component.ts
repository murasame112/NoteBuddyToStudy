import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { NotesService } from '../../../../../services/notes.service';
import { FinalNote } from 'src/app/models/finalNote.model';
import { User } from 'src/app/models/user.model';
import { UserRateNote } from 'src/app/models/userRateNote.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin-find-user-notes',
  templateUrl: './admin-find-user-notes.component.html',
  styleUrls: ['./admin-find-user-notes.component.scss'],
})
export class AdminFindUserNotesComponent extends Unsubscribe implements OnInit {
  constructor(
    private notesService: NotesService,
    private usersService: UsersService
  ) {
    super();
  }

  findUserNotesForm!: FormGroup;

  usersNotesOrigin: FinalNote[] = [];
  currentSearchedUserNotes: FinalNote[] = [];
  usersOrigin: User[] = [];

  notesDisplayedForUser: FinalNote[] = [];
  itemsPerPage = 3;
  currentPage = 0;
  maxPage!: number;
  @Input() currentUserId: string | undefined = undefined;
  @Input() currentUserRole: string | undefined = undefined;

  userSavedNotesIds: Array<string> = [];
  userNotesReviews: Array<UserRateNote> = [];
  loadingCounter: number = 0;
  isDataLoaded: boolean = false;

  ngOnInit(): void {
    this.getUserFavNotesIds();
    this.getUserNotesRates();

    this.getUsersNotes();
    this.getData();

    this.findUserNotesForm = new FormGroup({
      userName: new FormControl({ value: '', disabled: !this.isDataLoaded }),
    });

    //!

    this.maxPage =
      Math.ceil(this.currentSearchedUserNotes.length / this.itemsPerPage) - 1;
    this.updateDisplayedNotes();
    //!
  }

  //Pobieranie wszystkich tablic z bazy danych dotyczacych notatek
  getData() {
    this.notesService
      .getAllData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.usersOrigin = data[3];
        this.loadingCounter++;
        this.checkIfAllDataLoaded();
      });
  }

  getUsersNotes() {
    this.notesService
      .getAllNoteData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.usersNotesOrigin = res;
        this.loadingCounter++;
        this.checkIfAllDataLoaded();
      });
  }

  searchNotes() {
    let userName = this.findUserNotesForm.get('userName')?.value;
    this.currentSearchedUserNotes = [];

    if (this.usersNotesOrigin.length != 0 && userName != '') {
      this.usersNotesOrigin.forEach((note) => {
        if (note.login.toLocaleLowerCase() === userName.toLocaleLowerCase()) {
          this.currentSearchedUserNotes.push(note);
        }
      });
    } else {
    }

    this.currentPage = 0;
    this.maxPage =
      Math.ceil(this.currentSearchedUserNotes.length / this.itemsPerPage) - 1;
    this.updateDisplayedNotes();
  }

  updateDisplayedNotes() {
    const startIndex = this.currentPage * this.itemsPerPage;
    this.notesDisplayedForUser = this.currentSearchedUserNotes.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
      this.updateDisplayedNotes();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedNotes();
    }
  }

  refreshNoteData() {
    this.notesService
      .getAllNoteData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.usersNotesOrigin = res;
        this.searchNotes();
      });
  }

  getUserFavNotesIds() {
    if (this.currentUserId) {
      this.usersService
        .getUserById(this.currentUserId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (user) => {
            this.userSavedNotesIds = user.saved_notes;
            this.loadingCounter++;
            this.checkIfAllDataLoaded();
          },
          (error) => {}
        );
    }
  }

  getUserNotesRates() {
    if (this.currentUserId) {
      this.notesService
        .getNotesRatesByUserId(this.currentUserId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (userNotesRates) => {
            this.userNotesReviews = userNotesRates;
            this.loadingCounter++;
            this.checkIfAllDataLoaded();
          },
          (error) => {}
        );
    }
  }

  checkIfAllDataLoaded() {
    if (this.loadingCounter === 4) {
      this.isDataLoaded = true;
      this.findUserNotesForm.get('userName')?.enable();
    }
  }
}
