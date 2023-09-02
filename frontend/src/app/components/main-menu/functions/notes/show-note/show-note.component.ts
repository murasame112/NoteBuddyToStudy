import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { NotesService } from 'src/app/services/notes.service';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';
import { tap,delay} from 'rxjs/operators';

@Component({
  selector: 'app-show-note',
  templateUrl: './show-note.component.html',
  styleUrls: ['./show-note.component.scss']
})
export class ShowNoteComponent implements OnInit,OnDestroy{


constructor(private noteService:NotesService, private activatedRoute:ActivatedRoute) {}

isLoading:Boolean = true;

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


  this.noteService.getNoteById(id).pipe(
  delay(2000))
  .subscribe((res)=>{

      this.isLoading = false;
      this.note = res;
      console.log(this.note);
    },
    (error)=>{
      this.isLoading = false;
      console.log(error)
    })

  }

}
