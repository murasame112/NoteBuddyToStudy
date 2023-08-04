import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../../services/notes.service';
import {Note} from '../../../../models/note.model';
import { first } from 'rxjs';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit{

  constructor(private notesService: NotesService) {}
  ngOnInit(): void {
    this.getNotes();
  }

  allNotes:Note[] = [];


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
    .pipe(map((response:any)=>
    {
      const notes = [];
      for(const key in response)
      {

        if(response.hasOwnProperty(key))
        {
          notes.push({...response[key], id: key})
        }

      }
      return notes;
    }
    ))
    .subscribe(
      (res)=>{
        console.log(res);
        this.allNotes = res;
      }
      );
  }

}
