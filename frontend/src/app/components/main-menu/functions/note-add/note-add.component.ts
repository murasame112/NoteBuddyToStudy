
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Category } from 'src/app/enums/category';
import { Subcategory } from 'src/app/enums/subcategory';
import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent implements OnInit{

constructor(private notesService: NotesService) {}

    // category:Array<Category> = [];
       category = Object.values(Category);
       subcategory = Object.values(Subcategory);


  ngOnInit(): void {
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
      console.log(data.noteName)
      //  let newNote:Note = {
      //   name: data[0].value
      //  }

      let newNote: Note =
      {
        name:data.noteName,
        author_id: {"$oid":'64a49ff9a1caf26fbfaa2dbb'},
        category_id: {"$oid":'64a4a1d1a1caf26fbfaa2dc1'},
        subcategory_id:{"$oid":'64a4a367a1caf26fbfaa2dcc'},
        adress:'adres',
        description: data.noteDesc
      };

      this.notesService.addNote(newNote).subscribe(
        (response)=>{console.log(response)},


      )


    }
}
