import { Component, OnInit,EventEmitter } from '@angular/core';
import { NotesService } from '../../../../services/notes.service';
import {Note} from '../../../../models/note.model';
import { Observable, first,forkJoin } from 'rxjs';
import {concatAll, finalize, map} from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { User } from 'src/app/models/user.model';
import { NoteAndDetails } from 'src/app/models/noteAndDetails.model';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit{

  constructor(private notesService: NotesService) {}
  ngOnInit(): void {
    this.getAllNotes()
    // this.getNotes()
    // this.getCategories()
    // this.getSubcategories()
    // this.getUsers()


    this.FilterForm = new FormGroup(
      {
        categoryName:new FormControl(''),
        subcategoryName: new FormControl({value: '', disabled: true}),
        author: new FormControl(''),
        noteTitle: new FormControl(''),
      }
    )

  }

  isLoading:Boolean = true;

  notesWithDetails:any[] = [];

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
          return element.login.toLocaleLowerCase().startsWith(authorName.toLocaleLowerCase());
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
          //? jeśli ma szukać ogólnie po nazwach to można zamiast startWith dać includes
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


getAllNotes()
{
  this.notesService.getAllData().subscribe((res)=>{
        console.log("NOTES",res);

        this.allNotes = res[0];
        this.notesArray = this.allNotes;
        this.allCategories = res[1];
        this.allSubcategories =res[2];
        this.subcategoriesArray =this.allSubcategories;
        this.allUsers = res[3];


        this.allNotes.forEach((note,counter=0)=>
        {
          counter++
          console.warn(`Notatka:${counter}`,note._id,note.name)
          if(note.category_id != undefined && note.subcategory_id != undefined && note.author_id != undefined)
          {

            this.notesService.getAllDataById(note.category_id.toString(),note.subcategory_id.toString(),note.author_id.toString())
            .subscribe((response)=>{
              // console.log("test",response);
              if(note._id != undefined)
              {
               let noteWithDetails:NoteAndDetails = this.notesService.mergeNotesAndDetails(note._id?.toString(),note.name , response[0].name, response[1].name,response[2].login);
                // console.log("mergeNotatki",noteWithDetails);
                this.notesWithDetails.push(noteWithDetails);
              }
            })
          }

        })

        // console.log('tablica Details:',this.notesWithDetails)
        this.isLoading= false;
        this.defaultSort()

  })



}


  getNotes()
  {


    this.notesService.getNotes().pipe(
    // finalize(()=>{
    //   this.getAllNotesProperties();
    // })
    )
    .subscribe(
      (res)=>{
        console.log(res);
        this.allNotes = res;
        this.notesArray = this.allNotes;
        this.defaultSort()



      }
    );

  }

  getCategories()
  {
    this.notesService.getCategories().pipe(
      // finalize(()=>{
      //   this.getAllNotesProperties();
      // })
      )

    .subscribe(
      (res)=>{
        console.log(res);
        this.allCategories = res;



      }
      );


  }


  getSubcategories()
  {
    this.notesService.getSubcategories().pipe(
      // finalize(()=>{
      //   this.getAllNotesProperties();
      // })
      )
    .subscribe(
      (res)=>{
        console.log(res)
        this.allSubcategories =res;
        this.subcategoriesArray =this.allSubcategories;



      })

  }

  getUsers()
  {
    this.notesService.getUsers().pipe(
      // finalize(()=>{
      //   this.getAllNotesProperties();
      // })
      )
    .subscribe(
      (res)=>{
        console.log(res)
        this.allUsers = res;


      }
    )

  }


  refreshNoteData()
  {
    console.log("wykonane")
    this.getNotes()

  }


  defaultSort()
  {
    this.filteredNotes = this.allNotes;

    this.notesArray= this.filteredNotes.sort().reverse();

  }

  sortNotes($event:any)
  {

    let value:string |null = $event.target.value;

    if(value === "oldest")
    {
      this.filteredNotes = this.allNotes;

    this.notesArray = this.filteredNotes.sort((a,b)=>
    {
      if(a.shared_date && b.shared_date)
      {
        let dataA = new Date(a.shared_date);
        let dataB = new Date(b.shared_date);

        return dataA.getTime() - dataB.getTime();
      }else
      {
        console.log("noo")
        return 0
      }


    })

    }else if(value === "bestRate")
    {
        this.filteredNotes = this.allNotes;

        //TODO AUTOMATYCZNI PIERWSZE SORTOWANIE JEST PO NAJNOWSZYCH
      //   this.notesArray = this.filteredNotes.sort((a,b)=>{
      //     if(b.positive_reviews && a.positive_reviews)
      //     {
      //      Number(b.positive_reviews) - Number(a.positive_reviews)

      //       }return 0
      //  })

      this.notesArray = this.filteredNotes.sort((a,b)=>{
         if(a.positive_reviews && a.negative_reviews && b.positive_reviews && b.negative_reviews)
         {

         return   (b.positive_reviews- b.negative_reviews) - (a.positive_reviews- a.negative_reviews)
         }
         return 0


      })

    }else if(value === "worstRate")
    {

      this.filteredNotes = this.allNotes;

      this.notesArray = this.filteredNotes.sort((a,b)=>{
        if(a.positive_reviews && a.negative_reviews && b.positive_reviews && b.negative_reviews)
        {

        return   (a.positive_reviews- a.negative_reviews) - (b.positive_reviews- b.negative_reviews)
        }
        return 0


     })


    }else if(value === "newest")
    {
      this.filteredNotes = this.allNotes;

      this.notesArray= this.filteredNotes.sort().reverse();
    }

  }


}
