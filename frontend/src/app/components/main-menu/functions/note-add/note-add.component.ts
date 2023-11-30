import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Unsubscribe } from 'src/app/helpers/unsubscribe.class';

import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import { Category } from '../../../../models/category.model';
import { Subcategory } from '../../../../models/subcategory.model';
import Quill from 'quill';
import { CustomOption } from 'ngx-quill';
import Parchment from 'parchment';


//Rejestrowanie i dodawanie do listy wybranych czcionek
 const font = Quill.import('formats/font')
 font.whitelist = ['serif','arial', 'verdana', 'timesnewroman', 'roboto', 'monospace','poppins']
 Quill.register(font, true)

//  Dodawanie wybranych protokółów do linków w edytorze
const Link = Quill.import('formats/link')
Link.PROTOCOL_WHITELIST = ['http', 'https']
Link.sanitize = function(sanitizedUrl:string)
{
  if(!sanitizedUrl ||sanitizedUrl ==='about:blank') return sanitizedUrl;

  const hasWhitelistedProtocol = Link.PROTOCOL_WHITELIST.some(function(protocol:string){
    return sanitizedUrl.startsWith(protocol);
  })

  return hasWhitelistedProtocol? sanitizedUrl:`http://${sanitizedUrl}`
}
Quill.register(Link, true);

//Dodawanie image-resizera

//  import ImageResize from 'quill-image-resize-module';
// Quill.register('modules/imageResize', ImageResize);

import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);

//kompresowanie zdjęć
import ImageCompress from 'quill-image-compress';
Quill.register('modules/imageCompress', ImageCompress);


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

  isSubmitted:boolean = false;

  // editorModel = [{
  //   attributes: {
  //     font: ['roboto']
  //   }
  // }]
  //[(ngModel)]="editorModel" w html quillEditor

  addNoteForm = new FormGroup({
    noteName: new FormControl('', Validators.required),
    noteDesc: new FormControl('', Validators.required),
    courseName: new FormControl('', Validators.required),
    subjectName: new FormControl('', Validators.required),

  });


  ngOnInit(): void {
    this.getCategories();
    this.getSubcategories();

    this.addNoteForm = new FormGroup({
      noteName: new FormControl('', Validators.required),
      noteDesc: new FormControl('', Validators.required),
      courseName: new FormControl('', Validators.required),
      subjectName: new FormControl({ value: '', disabled: true },Validators.required),

    });


  }

  //Dodawanie notatki
  addNote(data: any) {
    console.log(data);

    let author_id: string = '652d7b38f2c51e59e3c6241e';
    let name: string = data.noteName;
    let content: string = data.noteDesc;
    let category_id: string = data.courseName;
    let subcategory_id: string = data.subjectName;
    this.isSubmitted = true;


    if(name !='' && content != ''&& content != null && category_id != '' && subcategory_id !='')
    {
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


    }else
    {
      alert("Nie wszystkie pola formularza zostały uzupełnione");
    }


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

  // Wyłączanie subcategory select gdy kierunek nie został wybrany
  onCategoryChange() {
    let categoryName = this.addNoteForm.get('courseName')?.value;
    this.addNoteForm.get('subjectName')?.disable();

    if (categoryName != null && categoryName != '') {
      this.addNoteForm.get('subjectName')?.enable();
    }

  }


  //! QUILL

  //Quill Modules

  quillModules = {
    toolbar: [
      [
        {'header':[2, 3, false]},
        {'size':['small', false, 'large']},
        {'font':['serif','arial', 'verdana', 'timesnewroman', 'roboto', 'monospace','poppins']},
      ],[],[],
      ['bold', 'italic', 'underline', 'strike','clean'],
      [ { 'indent': '-1'}, { 'indent': '+1' }],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{'align':''},{'align':'center'},{'align':'right'},{'align':'justify'}],
      ['link', 'image'],
    ],

    // imageResize: {},
    blotFormatter:{},
    imageCompress:{}

  };

  //Styles

  editorStyle = {
    backgroundColor: '#F7F7F7',
  };

  //CustomOptions
  quillPlaceholder="Wpisz tekst";

  //Quill output
  onEditorCreated(editor:any)
  {

    //Zmiana placeholdera dla linków
    let tooltip = editor.theme.tooltip;
    let input = tooltip.root.querySelector("input[data-link]");
    input.dataset.link = 'https://www.twms.pl';

  }


  //! /QUILL

}
