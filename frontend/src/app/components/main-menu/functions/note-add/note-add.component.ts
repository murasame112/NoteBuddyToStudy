import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';

import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import { Category } from '../../../../models/category.model';
import { Subcategory } from '../../../../models/subcategory.model';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss'],
})
export class NoteAddComponent extends Unsubscribe implements OnInit {
  constructor(private notesService: NotesService, private router: Router) {
    super();
  }

  categoryName: Category[] = [];
  categoryArray: Category[] = [];

  subcategoryOrigin: Subcategory[] = [];
  subcategoriesArray: Subcategory[] = [];
  subcategoryFilteredArray: Subcategory[] = [];

  ngOnInit(): void {
    this.getCategories();
    this.getSubcategories();

    this.addNoteForm = new FormGroup({
      noteName: new FormControl('', Validators.required),
      noteDesc: new FormControl('', Validators.required),
      courseName: new FormControl('', Validators.required),
      subjectName: new FormControl({ value: '', disabled: true }),
      typeName: new FormControl('', Validators.required),
    });
  }

  addNoteForm = new FormGroup({
    noteName: new FormControl('', Validators.required),
    noteDesc: new FormControl('', Validators.required),
    courseName: new FormControl('', Validators.required),
    subjectName: new FormControl('', Validators.required),
    typeName: new FormControl('', Validators.required),
  });

  //Dodawanie notatki
  addNote(data: any) {
    console.log(data);

    let name: string = data.noteName;
    let author_id: string = '652d7b38f2c51e59e3c6241e';
    let category_id: string = data.courseName;
    let subcategory_id: string = data.subjectName;
    let content: string = data.noteDesc;

    let newNote: Note = {
      name: name,
      author_id: author_id,
      category_id: category_id,
      subcategory_id: subcategory_id,
      content: content,
    };

    this.notesService
      .addNote(newNote)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        //! To jest do przerobienia response zwraca ID
        (response) => {
          console.log('ID:', response);
        },
        (error) => {
          console.log('Bład:', error);
        }
      );

    setTimeout(() => {
      this.router.navigate(['/notes']);
    }, 1000);
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
          // this.subcategoryName.push(e.name);
          this.subcategoriesArray.push(e);
        });

        for (let i = 0; i < res.length; i++) {
          this.subcategoryOrigin.push(res[i]);
        }
      });
  }

  //Filtrowanie podkategorii na podstawie kategorii
  filterSubcategories() {
    let courseId = this.addNoteForm.get('courseName')?.value;
    this.subcategoryFilteredArray = this.subcategoryOrigin;

    if (courseId != null && courseId != '') {
      this.subcategoryFilteredArray = this.subcategoryFilteredArray.filter(
        (e) => {
          return e.category_id === courseId;
        }
      );
      // console.log('FilteredSubcategories', this.subcategoryFilteredArray);
      // console.log('categoryNAME', this.categoryName);
      this.subcategoriesArray = this.subcategoryFilteredArray;
    }

    this.onCategoryChange();
  }

  //Włączanie i wyłączanie wyboru podkategorii
  onCategoryChange() {
    let categoryName = this.addNoteForm.get('courseName')?.value;
    this.addNoteForm.get('subjectName')?.disable();

    if (categoryName != null && categoryName != '') {
      this.addNoteForm.get('subjectName')?.enable();
    }
  }

  //! QUILL
  editorStyle = {
    backgroundColor: '#F7F7F7',
  };

  quillConfig = {
    toolbar: [
      [{ header: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
    ],
  };

  //! /QUILL
}
