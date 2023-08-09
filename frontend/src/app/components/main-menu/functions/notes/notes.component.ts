import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../../services/notes.service';
import {Note} from '../../../../models/note.model';
import { first } from 'rxjs';
import {concatAll, map} from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/models/category.model';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit{

  constructor(private notesService: NotesService) {}
  ngOnInit(): void {
    this.getNotes();
    this.getCategories();
    this.getSubcategories();

    this.FilterForm = new FormGroup(
      {
        categoryName:new FormControl(''),
        subcategoryName: new FormControl(''),
        author: new FormControl(''),
        noteTitle: new FormControl(''),
      }
    )

  }

  allNotes:Note[] = [];
  notesArray:Note[] =[];
  filteredNotes:Note[]= [];

  allCategories:any[] = [];
  allSubcategories:any[] =[];

  selectedCategory:string = ""




  FilterForm = new FormGroup(
    {
      categoryName: new FormControl(''),
      subcategoryName: new FormControl({value: '', disabled: true}),
      author: new FormControl(''),
      noteTitle: new FormControl(''),
    }
  )

    applyFilters()
    {
      console.log(this.selectedCategory);
      let subcategoryName = this.FilterForm.get('subcategoryName')?.value;
      // console.log(`FormControlSubcategory:${subcategoryName}`)

      this.filteredNotes = this.allNotes;


      //CategoryFilter
      if(this.selectedCategory != null && this.selectedCategory !="")
      {

        this.filteredNotes = this.filteredNotes.filter(element=>{
          return element.category_id === this.selectedCategory;

        });

        //SubcategoryFilter
      if(subcategoryName != null && subcategoryName !="")
      {
        this.filteredNotes = this.filteredNotes.filter(element=>{
          return element.subcategory_id === subcategoryName
        })
      }

      }

      // for(let i=0;i<this.filteredNotes.length;i++)
      // {
      //   console.log(this.filteredNotes[i]);
      // }

      // console.warn("POSORTOWANE!")
      this.notesArray = this.filteredNotes;

    }

    get onCategoryChange()
    {
      let test
      //  test= this.FilterForm.get('categoryName')?.value != null &&
      // this.FilterForm.get('categoryName')?.value !='';
      // console.log(test,this.FilterForm.get('categoryName')?.value);

      return test

    }

  addNote() {

    // let newNote: Note = {
    //   name: 'notatka1',
    //   author_id: 3987352013769012,
    //   category_id: 495769712496012357,
    //   subcategory_id:25977439234672195,
    //   adress: 'Adres',
    //   description: 'Opis',

    // };

    // this.notesService.addNote(newNote).pipe(first()).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );

  }

  getNotes()
  {
    this.notesService.getNotes()
    .subscribe(
      (res)=>{
        console.log(res);
        this.allNotes = res;
        this.notesArray = this.allNotes;
      }
    );
  }

  getCategories()
  {
    this.notesService.getCategories()

    .subscribe(
      (res)=>{
        console.log(res);
        this.allCategories = res;
      }
      );
  }

  getCategoryById(id:string)
  {
    // this.notesService.getCategoryById(id)
    // .pipe(
    //   map((response:any)=>{
    //     const name = response;
    //     return name;
    //   })

    // )

    // .subscribe(
    //   (res)=>{
    //     console.log(res.name)
    //   }
    // );



    // this.notesService.getCategoryById(id)
    // .subscribe((res)=>{
    //   console.log(res.name);
    //   // return res.name;
    // })

    // this.notesService.getCategoryById(id);
  }

  getSubcategories()
  {
    this.notesService.getSubcategories().subscribe(
      (res)=>{
        console.log(res)
        this.allSubcategories =res;
      })
  }


}
