import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';
import { Category } from 'src/app/models/category.model';
import { Note } from 'src/app/models/note.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { AuthService } from 'src/app/services/auth.service';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss'],
})
export class EditNoteComponent extends Unsubscribe implements OnInit {
  constructor(
    private notesService: NotesService,
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  isLoading: Boolean = true;

  categoryName: Category[] = [];
  categoryArray: Category[] = [];

  subcategoryOrigin: Subcategory[] = [];
  subcategoriesArray: Subcategory[] = [];
  subcategoryFilteredArray: Subcategory[] = [];

  editNoteForm!: FormGroup;
  NoteId: string = '';

  editedNote!: Note;

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((param) => {
        this.NoteId = param['id'];
      });

    this.getCategories();
    this.getSubcategories();

    this.editNoteForm = new FormGroup({
      noteName: new FormControl('', Validators.required),
      noteDesc: new FormControl('', Validators.required),
      courseName: new FormControl('', Validators.required),
      subjectName: new FormControl('', Validators.required),
    });
  }

  //edytowanie notatki
  editNote(data: any) {
    if (this.authService.currentUserSignal()) {
      let author_id: any = this.authService
        .currentUserSignal()
        ?._id?.toString();
      let name: string = data.noteName;
      let content: string = data.noteDesc;
      let category_id: string = data.courseName;
      let subcategory_id: string = data.subjectName;

      if (
        name != '' &&
        content != '' &&
        content != null &&
        category_id != '' &&
        subcategory_id != ''
      ) {
        let updateNote: Note = {
          name: name,
          author_id: author_id,
          category_id: category_id,
          subcategory_id: subcategory_id,
          content: content,
        };

        this.notesService
          .updateNote(updateNote, this.NoteId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (response) => {},
            (error) => {}
          );

        setTimeout(() => {
          this.router.navigate(['/mynotes']);
        }, 1500);
      } else {
        alert('Nie wszystkie pola formularza zostały uzupełnione');
      }
    }
  }

  getNote(id: string) {
    this.notesService
      .getNoteById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (note) => {
          this.isLoading = false;
          this.editedNote = note;

          this.editNoteForm.patchValue({
            noteName: this.editedNote.name,
            noteDesc: this.editedNote.content,
            courseName: this.editedNote.category_id,
            subjectName: this.editedNote.subcategory_id,
          });

          // this.filterSubcategories();
          this.filterSubcategoriesOnInit();
        },
        (error) => {}
      );
  }

  getCategories() {
    this.notesService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.categoryArray = res;
        res.forEach((element) => {
          this.categoryName.push(element.name);
        });
      });
  }

  getSubcategories() {
    this.notesService
      .getSubcategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        res.forEach((e) => {
          this.subcategoriesArray.push(e);
        });

        for (let i = 0; i < res.length; i++) {
          this.subcategoryOrigin.push(res[i]);
        }

        this.getNote(this.NoteId);
      });
  }

  filterSubcategoriesOnInit() {
    let courseId = this.editNoteForm.get('courseName')?.value;
    this.subcategoryFilteredArray = this.subcategoryOrigin;

    if (courseId != null && courseId != '') {
      this.subcategoryFilteredArray = this.subcategoryFilteredArray.filter(
        (e) => {
          return e.category_id === courseId;
        }
      );
      this.subcategoriesArray = this.subcategoryFilteredArray;
    }
  }

  //Filtrowanie podkategorii na podstawie kategorii
  filterSubcategories() {
    let courseId = this.editNoteForm.get('courseName')?.value;
    this.subcategoryFilteredArray = this.subcategoryOrigin;

    if (courseId != null && courseId != '') {
      this.subcategoryFilteredArray = this.subcategoryFilteredArray.filter(
        (e) => {
          return e.category_id === courseId;
        }
      );
      this.subcategoriesArray = this.subcategoryFilteredArray;
    }

    this.onCategoryChange();
  }

  // Wyłączanie subcategory select gdy kierunek nie został wybrany
  onCategoryChange() {
    let categoryName = this.editNoteForm.get('courseName')?.value;
    this.editNoteForm.get('subjectName')?.setValue('');

    if (categoryName != null && categoryName != '') {
      this.editNoteForm.get('subjectName')?.enable();
    } else {
      this.editNoteForm.get('subjectName')?.disable();
    }
  }

  //! QUILL

  //Quill Modules

  quillModules = {
    toolbar: [
      [
        { header: [2, 3, false] },
        { size: ['small', false, 'large'] },
        {
          font: [
            'serif',
            'arial',
            'verdana',
            'timesnewroman',
            'roboto',
            'monospace',
            'poppins',
          ],
        },
      ],
      [],
      [],
      ['bold', 'italic', 'underline', 'strike', 'clean'],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [
        { align: '' },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' },
      ],
      ['link', 'image'],
    ],

    // imageResize: {},
    blotFormatter: {},
    imageCompress: {},
  };

  //Styles

  editorStyle = {
    backgroundColor: '#F7F7F7',
  };

  //CustomOptions
  quillPlaceholder = 'Wpisz tekst';

  //Quill output
  onEditorCreated(editor: any) {
    //Zmiana placeholdera dla linków
    let tooltip = editor.theme.tooltip;
    let input = tooltip.root.querySelector('input[data-link]');
    input.dataset.link = 'https://www.twms.pl';

    //Quill add names to selects

    let qlHeader = document.querySelector('select.ql-header');
    let qlSize = document.querySelector('select.ql-size');
    let qlFont = document.querySelector('select.ql-font');
    let qlColor = document.querySelector('select.ql-color');
    let qlBackground = document.querySelector('select.ql-background');
    qlHeader?.setAttribute('name', 'ql-header');
    qlSize?.setAttribute('name', 'ql-size');
    qlFont?.setAttribute('name', 'ql-font');
    qlColor?.setAttribute('name', 'ql-color');
    qlBackground?.setAttribute('name', 'ql-background');

    //Quill set input name for ql-tooltip
    let qlTooltipInput = document.querySelector(
      '.ql-tooltip input[data-link="https://www.twms.pl"]'
    );
    qlTooltipInput?.setAttribute('name', 'ql-twms');
  }
}
