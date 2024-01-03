import { Component, OnInit, EventEmitter } from '@angular/core';
import { NotesService } from '../../../../services/notes.service';
import { Note } from '../../../../models/note.model';
import { Observable, first, forkJoin } from 'rxjs';
import { concatAll, finalize, map, take, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { User } from 'src/app/models/user.model';
import { NoteAndDetails } from 'src/app/models/noteAndDetails.model';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { FinalNote } from 'src/app/models/finalNote.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent extends Unsubscribe implements OnInit {
  constructor(
    private notesService: NotesService,
    public authService: AuthService,
    private usersService: UsersService
  ) {
    super();
  }
  ngOnInit(): void {
    this.getAllNotesArrays();
    this.getFinalNotes();
    this.getUserFavNotes();

    this.userNotesReviews =
      this.authService.currentUserSignal()?.rated_notes || [];
    // console.log('reviews', this.userNotesReviews);

    this.FilterForm = new FormGroup({
      categoryName: new FormControl(''),
      subcategoryName: new FormControl({ value: '', disabled: true }),
      author: new FormControl(''),
      noteTitle: new FormControl(''),
    });
  }

  isLoading: Boolean = true;

  finalNotesOrigin: FinalNote[] = [];
  finalNotesArray: FinalNote[] = [];
  filteredFinalNotes: FinalNote[] = [];

  notesOrigin: Note[] = [];
  notesArray: Note[] = [];

  categoriesOrigin: Category[] = [];
  selectedCategory: string | null | undefined = '';

  subcategoriesOrigin: Subcategory[] = [];
  subcategoriesArray: Subcategory[] = [];
  filteredsubcategories: Subcategory[] = [];

  allUsers: User[] = [];

  currentUserId: string | undefined = this.authService.currentUserSignal()?._id;
  currentUserRole: string | undefined =
    this.authService.currentUserSignal()?.role;
  userSavedNotes: Array<string> = [];
  userNotesReviews: Array<object> = [];

  FilterForm = new FormGroup({
    categoryName: new FormControl(''),
    subcategoryName: new FormControl({ value: '', disabled: false }),
    author: new FormControl(''),
    noteTitle: new FormControl(''),
  });

  //Zastosowanie filtrowanie po dostępnych opcji
  applyFilters() {
    let subcategoryName = this.FilterForm.get('subcategoryName')?.value;
    let categoryId = this.FilterForm.get('categoryName')?.value;
    let authorName = this.FilterForm.get('author')?.value ?? '';
    let noteTitle: string = this.FilterForm.get('noteTitle')?.value ?? '';

    this.selectedCategory = categoryId;

    this.filteredFinalNotes = this.finalNotesOrigin;
    this.filteredsubcategories = this.subcategoriesOrigin;

    if (this.selectedCategory == '') {
      this.FilterForm.get('subcategoryName')?.setValue('');
      console.log('default category value');
    }

    //CategoryFilter
    if (this.selectedCategory != null && this.selectedCategory != '') {
      this.filteredFinalNotes = this.filteredFinalNotes.filter((element) => {
        return element.category_id === this.selectedCategory;
      });

      //SubcategoryFilter
      if (subcategoryName != null && subcategoryName != '') {
        this.filteredFinalNotes = this.filteredFinalNotes.filter((element) => {
          return element.subcategory_id === subcategoryName;
        });
      }

      //SubcategoryArrayFilter
      this.filteredsubcategories = this.filteredsubcategories.filter((e) => {
        return e.category_id === categoryId;
      });
      this.subcategoriesArray = this.filteredsubcategories;
    }

    //AuthorFilter
    if (authorName != null && authorName != '') {
      const filteredUsers = this.finalNotesOrigin.filter((element) => {
        return element.login
          .toLocaleLowerCase()
          .startsWith(authorName.toLocaleLowerCase());
      });

      const filteredUsersIds = filteredUsers.map((e) => e.author_id);

      this.filteredFinalNotes = this.filteredFinalNotes.filter((element) => {
        return filteredUsersIds.includes(element.author_id.toString());
      });
    }

    //NameFilter
    if (noteTitle != null && noteTitle != '') {
      this.filteredFinalNotes = this.filteredFinalNotes.filter((element) => {
        //? jeśli ma szukać ogólnie po nazwach to można zamiast startWith dać includes
        const noteName = element.noteName.toLocaleLowerCase();
        const actualSearchTitle = noteTitle.toLocaleLowerCase();

        return (
          noteName.startsWith(actualSearchTitle) ||
          this.wordsSplitter(noteName, actualSearchTitle)
        );
      });
    }

    //Przypisywanie
    // this.notesArray = this.filteredNotes;
    this.finalNotesArray = this.filteredFinalNotes;
  }

  // dzielenie podanej nazwy notatki na pojedyncze slowa
  wordsSplitter(noteName: string, actualInputTitle: string): boolean {
    const words = noteName.split(' ');

    for (const word of words) {
      if (word.startsWith(actualInputTitle)) {
        // console.log('pasujace slowo', word);
        return true;
      }
    }

    return false;
  }

  // Wyłączanie subcategory select gdy kierunek nie został wybrany
  categorySelectionChangeFunc() {
    this.applyFilters();

    let categoryName = this.FilterForm.get('categoryName')?.value;
    let subcatID = this.FilterForm.get('subcategoryName')?.value;

    this.FilterForm.get('subcategoryName')?.disable();

    if (categoryName != null && categoryName != '') {
      this.FilterForm.get('subcategoryName')?.enable();
      if (subcatID != '') {
        this.FilterForm.get('subcategoryName')?.setValue('');
        this.filteredFinalNotes = this.finalNotesOrigin;
        this.applyFilters();
        this.finalNotesArray = this.filteredFinalNotes;
      }
    }
  }

  //Pobieranie notatki z jej wszystkimi informacjami
  getFinalNotes() {
    this.notesService
      .getAllNoteData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        // console.log('note:', res);
        this.finalNotesOrigin = res;
        this.finalNotesArray = this.finalNotesOrigin;
        this.defaultSort();
        this.isLoading = false;
      });
  }

  //Pobieranie wszystkich tablic z bazy danych dotyczacych notatek
  getAllNotesArrays() {
    this.notesService
      .getAllData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        // console.log('notesArrays', res);

        this.notesOrigin = res[0];
        this.notesArray = this.notesOrigin;
        this.categoriesOrigin = res[1];
        this.subcategoriesOrigin = res[2];
        this.subcategoriesArray = this.subcategoriesOrigin;
        this.allUsers = res[3];
      });
  }

  getNotes() {
    this.notesService
      .getNotes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        console.log(res);
        this.notesOrigin = res;
        this.notesArray = this.notesOrigin;
        // this.defaultSort();
      });
  }

  getCategories() {
    this.notesService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        console.log(res);
        this.categoriesOrigin = res;
      });
  }

  getSubcategories() {
    this.notesService
      .getSubcategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        console.log(res);
        this.subcategoriesOrigin = res;
        this.subcategoriesArray = this.subcategoriesOrigin;
      });
  }

  getUsers() {
    this.notesService
      .getUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        console.log(res);
        this.allUsers = res;
      });
  }

  refreshNoteData() {
    console.log('wykonane');
    // this.getNotes();
    this.getAllNotesArrays();
    this.getFinalNotes();
  }

  //Domyślne sortowanie przy właczeniu strony
  defaultSort() {
    this.finalNotesArray.sort((a, b) => {
      const dataA = new Date(a.shared_date).getTime();
      const dataB = new Date(b.shared_date).getTime();
      return dataB - dataA;
    });
  }

  //sortowanie notatek
  sortNotes($event: any) {
    let value: string | null = $event.target.value;
    console.log('wywolanie');
    this.applyFilters();
    this.filteredFinalNotes.reverse();

    if (value === 'newest') {
      this.filteredFinalNotes.sort((a, b) => {
        const dataA = new Date(a.shared_date).getTime();
        const dataB = new Date(b.shared_date).getTime();
        return dataB - dataA;
      });
    } else if (value === 'oldest') {
      this.filteredFinalNotes.sort((a, b) => {
        const dataA = new Date(a.shared_date).getTime();
        const dataB = new Date(b.shared_date).getTime();
        return dataA - dataB;
      });
    } else if (value === 'bestRate') {
      this.filteredFinalNotes.sort((a, b) => {
        // const rateA = a.positive_reviews - a.negative_reviews;
        // const rateB = b.positive_reviews - b.negative_reviews;
        const rateA =
          (a.positive_reviews * 100) /
          (a.positive_reviews + a.negative_reviews);
        const rateB =
          (b.positive_reviews * 100) /
          (b.positive_reviews + b.negative_reviews);

        return rateB - rateA;
      });
    } else if (value === 'worstRate') {
      this.filteredFinalNotes.sort((a, b) => {
        // const rateA = a.positive_reviews - a.negative_reviews;
        // const rateB = b.positive_reviews - b.negative_reviews;
        const rateA =
          (a.positive_reviews * 100) /
          (a.positive_reviews + a.negative_reviews);
        const rateB =
          (b.positive_reviews * 100) /
          (b.positive_reviews + b.negative_reviews);
        return rateA - rateB;
      });
    } else {
      return;
    }

    this.finalNotesArray = this.filteredFinalNotes;
  }

  //Fav notes
  getUserFavNotes() {
    if (this.currentUserId) {
      this.usersService
        .getUserById(this.currentUserId)
        .pipe(take(1))
        .subscribe(
          (user) => {
            this.userSavedNotes = user.saved_notes;
            // console.log(user.saved_notes);
          },
          (error) => {}
        );
    }
  }
}
