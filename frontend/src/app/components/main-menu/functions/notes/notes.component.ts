import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../../services/notes.service';
import {Note} from '../../../../models/note.model';
import { first } from 'rxjs';
import {concatAll, map} from 'rxjs/operators';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit{

  constructor(private notesService: NotesService) {}
  ngOnInit(): void {
    this.getNotes();
    // this.getCategories();


  }

  allNotes:Note[] = [];
  allCategories:any[] = [];


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

    this.notesService.getCategoryById(id);
  }


}
