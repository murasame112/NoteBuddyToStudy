import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-show-note',
  templateUrl: './show-note.component.html',
  styleUrls: ['./show-note.component.scss']
})
export class ShowNoteComponent implements OnInit,OnDestroy{


constructor(private noteService:NotesService, private activatedRoute:ActivatedRoute) {}


ngOnInit(): void {
  let id:string = "";
  this.activatedRoute.params.subscribe(param =>{
    id = param['id'];
  })
    this.getNote(id);
  }

  ngOnDestroy(): void {

  }

note!:Note;

  getNote(id:string)
  {
    this.noteService.getNoteById(id).subscribe((res)=>{
      this.note = res;
      console.log(this.note);
    },
    (error)=>{
      console.log(error)
    })
  }

}
