
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
// import { Category } from 'src/app/enums/category';
// import { Subcategory } from 'src/app/enums/subcategory';
import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import {Category} from '../../../../models/category.model';
import { Subcategory } from 'src/app/enums/subcategory';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent implements OnInit{

constructor(private notesService: NotesService) {}


      //  category = Object.values(Category);
      //  subcategory = Object.values(Subcategory);
       categoryName:Category[] = [];
       category:Category[] =[];
       subcategoryName:Subcategory[] = [];
       subcategory:Subcategory[] = [];



  ngOnInit(): void {
    this.getCategories();
    this.getSubcategories();

    this.addNoteForm = new FormGroup(
      {
        noteName: new FormControl('' ,Validators.required)  ,
        noteDesc: new FormControl('' ,Validators.required),
        courseName: new FormControl('' ,Validators.required),
        subjectName: new FormControl('' ,Validators.required),
        typeName: new FormControl('' ,Validators.required),
      });
  }

  addNoteForm = new FormGroup(
    {
      noteName: new FormControl('' ,Validators.required)  ,
      noteDesc: new FormControl('' ,Validators.required),
      courseName: new FormControl('' ,Validators.required),
      subjectName: new FormControl('' ,Validators.required),
      typeName: new FormControl('' ,Validators.required),
    });



    addNote(data:any)
    {

      console.log(data);
      // console.log(data.courseName.name);
      // console.log(data.noteName)
      //  let newNote:Note = {
      //   name: data[0].value
      //  }

      // let newNote: Note =
      // {
      //   name:data.noteName,
      //   author_id: '64a49ff9a1caf26fbfaa2dbb',
      //   category_id:'64a4a1d1a1caf26fbfaa2dc1',
      //   subcategory_id:'64a4a367a1caf26fbfaa2dcc',
      //   adress:'adres',
      //   description: data.noteDesc
      // };

      // this.notesService.addNote(newNote).subscribe(
      //   (response)=>{console.log(response)},


      // )

     this.categoryArrayList();


    }

    getCategories()
    {
      this.notesService.getCategories().subscribe((res)=>{
        // console.log(res)
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


}


