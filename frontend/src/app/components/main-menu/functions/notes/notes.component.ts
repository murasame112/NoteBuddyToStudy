import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../../services/notes.service';
import {Note} from '../../../../models/note.model';
import { first } from 'rxjs';
import {concatAll, map} from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { User } from 'src/app/models/user.model';


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
    this.getUsers();

    this.FilterForm = new FormGroup(
      {
        categoryName:new FormControl(''),
        subcategoryName: new FormControl({value: '', disabled: true}),
        author: new FormControl(''),
        noteTitle: new FormControl(''),
      }
    )

  }

  allNotes:Note[] = [];
  notesArray:Note[] =[];
  filteredNotes:Note[]= [];

  allCategories:Category[] = [];
  selectedCategory:string = ""



  allSubcategories:Subcategory[] =[];
  subcategoriesArray:Subcategory[] = [];
  filteredsubcategories:Subcategory[] = [];


  allUsers:User[]=[]





  FilterForm = new FormGroup(
    {
      categoryName: new FormControl(''),
      subcategoryName: new FormControl({value: '', disabled: false}),
      author: new FormControl(''),
      noteTitle: new FormControl(''),
    }
  )

    applyFilters()
    {
      console.log(this.selectedCategory);
      let subcategoryName = this.FilterForm.get('subcategoryName')?.value;
      let categoryId = this.FilterForm.get('categoryName')?.value;
      let authorName = this.FilterForm.get('author')?.value ?? "";
      let noteTitle:string = this.FilterForm.get('noteTitle')?.value ?? "";

      console.log(this.allUsers);

      this.filteredNotes = this.allNotes;
      this.filteredsubcategories = this.allSubcategories;

      if(this.selectedCategory == "")
      {
        this.FilterForm.get('subcategoryName')?.setValue("")
      }

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

      //SubcategoryArrayFilter
      this.filteredsubcategories = this.filteredsubcategories.filter((e)=>{
        return e.category_id === categoryId;
      })
      this.subcategoriesArray = this.filteredsubcategories;

      this.filteredsubcategories.forEach(e =>{
        console.log(`Filtered subcategories Id: ${e.category_id} `)
      })
      }

      //AuthorFilter
      if(authorName != null && authorName !='')
      {
        const filteredUsers = this.allUsers.filter(element =>{
          return element.name.toLocaleLowerCase().startsWith(authorName.toLocaleLowerCase());
        })

       const filteredUsersIds = filteredUsers.map(e =>e._id);


        this.filteredNotes = this.filteredNotes.filter(element =>{
          return filteredUsersIds.includes(element.author_id.toString());
        })
      }


      //NameFilter
      if(noteTitle != null && noteTitle !='')
      {
        this.filteredNotes = this.filteredNotes.filter(element =>{
          //! jeśli ma szukać ogólnie po nazwach to można zamiast startWith dać includes
          return element.name.toLocaleLowerCase().includes(noteTitle.toLocaleLowerCase())
        })
      }



      //Przypisywanie
      this.notesArray = this.filteredNotes;

    }

    // Wyłączanie subcategory select gdy kierunek nie został wybrany
    get onCategoryChange()
    {
      let categoryName = this.FilterForm.get('categoryName')?.value;
      this.FilterForm.get('subcategoryName')?.disable();

      if(categoryName !=null && categoryName !='')
      {
        this.FilterForm.get('subcategoryName')?.enable();

      }


      return true

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
        this.subcategoriesArray =this.allSubcategories;
      })
  }

  getUsers()
  {
    this.notesService.getUsers().subscribe(
      (res)=>{
        console.log(res)
        this.allUsers = res;
      }
    )
  }


}
