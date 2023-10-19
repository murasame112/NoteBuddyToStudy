
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
// import { Category } from 'src/app/enums/category';
// import { Subcategory } from 'src/app/enums/subcategory';
import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import {Category} from '../../../../models/category.model';
import { Subcategory } from '../../../../models/subcategory.model';
import { Router } from '@angular/router';

import { ObjectId } from 'bson';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent implements OnInit{

constructor(private notesService: NotesService, private router: Router) {}


      //  category = Object.values(Category);
      //  subcategory = Object.values(Subcategory);
       categoryName:Category[] = [];
       categoryArray:Category[] = [];
       category:Category[] =[];

       subcategoryName:Subcategory[] = [];
       subcategoriesArray:Subcategory[] = [];
       subcategoryFilteredArray:Subcategory[] = [];
       subcategory:Subcategory[] = [];


       selectedCategory:string ="";


       noteArray:Note[]=[];



  ngOnInit(): void {
    this.getCategories();
    this.getSubcategories();
    this.getValue();

    this.addNoteForm = new FormGroup(
      {
        noteName: new FormControl('' ,Validators.required)  ,
        noteDesc: new FormControl('' ,Validators.required),
        courseName: new FormControl('' ,Validators.required),
        subjectName: new FormControl({value: '', disabled: true}),
        typeName: new FormControl('' ,Validators.required),
      });
  }

  addNoteForm = new FormGroup(
    {
      noteName: new FormControl('' ,Validators.required),
      noteDesc: new FormControl('' ,Validators.required),
      courseName: new FormControl('' ,Validators.required),
      subjectName: new FormControl('' ,Validators.required),
      typeName: new FormControl('' ,Validators.required),
    });


    getValue()
    {
    this.notesService.getNotes().subscribe
    ((res)=>{
     this.noteArray = res;
     console.log(this.noteArray);
    })

    }


    addNote(data:any)
    {

      console.log(data);

      let name:string = data.noteName;
      let author_id:string = "652d7b38f2c51e59e3c6241e";
      let category_id:string = data.courseName;
      let subcategory_id:string = data.subjectName;
      let adress:string ="note_url_link";
      let description:string = data.noteDesc;



      let newNote: Note =
      {
        name:name,
        author_id: author_id,
        category_id: category_id,
        subcategory_id: subcategory_id,
        adress: adress,
        description: description


      };

      this.notesService.addNote(newNote).subscribe(
        //! To jest do przerobienia response to zwrocone id
        (response)=>{
          if(response.status === 201)
          {
            let insertedId:string = response.body;
            console.log(`Dodano notatkę o id:${insertedId}`);
          }else if(response.status === 400)
          {
            console.log("Error status 400:",response)
          }else if(response.status ===200)
          {
            console.log(response,"status 200");
          }else
          console.log("Inny status")
          console.log(response);

        },
        (error)=>{console.log("Bład:",error)}
 )

    //  this.categoryArrayList();

        setTimeout(()=>{
          this.router.navigate(['/notes']);
        },1000);
    }

    getCategories()
    {
      this.notesService.getCategories().subscribe((res)=>{
        // console.log(res)
        this.categoryArray = res;
        res.forEach(element => {
          this.categoryName.push(element.name);

          // this.category.push(element.id);
          // this.category.push(element.name);
          // this.category.push(element._id);
        });

        for(let i=0;i<res.length;i++)
        {
          this.category.push(res[i])
          // console.log(this.category)
        }

      });

    }

    getSubcategories()
    {
      this.notesService.getSubcategories().subscribe((res)=>{
        res.forEach(e =>{
          this.subcategoryName.push(e.name);
          this.subcategoriesArray.push(e);
        });

        for(let i=0;i<res.length;i++)
        {
          // for(let j=0;j<this.category.length;j++)
          // {
          //   if(res[i].category_id ===this.category[j]._id)
          //   {
          //     console.log(res[i].category_id);
          //     console.log(this.category[j]._id);

          //   }

          // }

          this.subcategory.push(res[i])
          // console.log(this.subcategory)
        }

      });
    }

    categoryArrayList()
    {
      for(let i =0;i<this.category.length;i++)
      {
        console.log(this.category[i]);
      }

      console.warn("================")

      for(let i =0;i<this.subcategory.length;i++)
      {
        console.log(this.subcategory[i]);
      }
    }

    filterSubcategory(categoryName:string)
    {


      let selectedCategoryId:string ="";
      // console.log(categoryName)

      for(let i=0;i<this.category.length;i++)
      {

        if(this.category[i].name === categoryName)
        {
          selectedCategoryId = this.category[i]._id;

          // for(let j=0;j<this.subcategory.length;j++)
          // {
          //   if(this.subcategory[j].category_id ===  selectedCategoryId)
          //   {
          //     for(let x=0;x<this.subcategory.length;x++)
          //     {
          //       console.log(this.subcategory[x].name);
          //     }
          //   }
          // }


        }
      }

      console.log(`name:${categoryName} id:${selectedCategoryId}`)


    }

    filterSubcategories()
    {
      let courseId = this.addNoteForm.get('courseName')?.value;
      let subjectName = this.addNoteForm.get('subjectName')?.value;

      this.subcategoryFilteredArray = this.subcategory;

      console.log(this.subcategoryFilteredArray)

      if(courseId !=null && courseId !="")
      {
        this.subcategoryFilteredArray = this.subcategoryFilteredArray.filter(e=>{
          return e.category_id === courseId


        })
        this.subcategoriesArray = this.subcategoryFilteredArray;

      }


    }


    get onCategoryChange()
    {
      let categoryName = this.addNoteForm.get('courseName')?.value;
      this.addNoteForm.get('subjectName')?.disable();

      if(categoryName !=null && categoryName !='')
      {
        this.addNoteForm.get('subjectName')?.enable();

      }


      return true

    }

    editorStyle = {
      width: '35rem',
      height: '20rem',
      backgroundColor: '#F7F7F7',
      border: '1px solid #d8d7d7',


    }

    quillConfig = {
      toolbar: [
        [{'header':[]}],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
      ],


    }


}


