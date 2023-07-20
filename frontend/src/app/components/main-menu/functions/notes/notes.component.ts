import { Component } from '@angular/core';
import { NotesService } from '../../../../services/notes.service';
import {Note} from '../../../../models/note.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

  constructor(private notesService: NotesService) {}

  addNote() {

    const newNote: Note = {
      name: 'notatka1',
      author_id: 3987352013769012,
      category_id: 495769712496012357,
      subcategory_id: 12435346435345353453453,
      adress: 'Adres',
      description: 'Opis',

    };

    this.notesService.addNote(newNote).subscribe(
      (response) => {
        console.log('Notatka dodana!', response);
      },
      (error) => {
        console.error('Błąd podczas dodawania notatki:', error);
      }
    );
  }

}
