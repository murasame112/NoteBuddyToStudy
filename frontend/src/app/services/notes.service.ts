import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { Note } from '../models/note.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  public apiUrl = 'http://localhost:3000';

  constructor(private http:HttpClient) { }


  addNote(note:Note):Observable<any>
  {

    const url = `${this.apiUrl}/note-add`;
    return this.http.post(url,note);
  }
}
