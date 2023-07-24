import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent implements OnInit{

constructor() {


}
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
