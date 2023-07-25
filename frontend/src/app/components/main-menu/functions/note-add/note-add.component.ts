import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Category } from 'src/app/enums/category';
import { Subcategory } from 'src/app/enums/subcategory';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent implements OnInit{

constructor() {

}

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
      console.log(data.value)
    }
}
