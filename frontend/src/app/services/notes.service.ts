import { Injectable } from '@angular/core';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { Note } from '../models/note.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsersService } from './users.service';
import { NoteAndDetails } from '../models/noteAndDetails.model';
import { FinalNote } from '../models/finalNote.model';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  public apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private userService: UsersService) {}

  addNote(note: Note): Observable<any> {
    const url = `${this.apiUrl}/note`;
    return this.http.post(url, note);
  }

  getNotes() {
    const url = `${this.apiUrl}/notes`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const notes = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            notes.push({ ...response[key], id: key });
          }
        }
        return notes;
      })
    );
  }

  getNoteById(id: string) {
    const url = `${this.apiUrl}/note/${id}`;
    return this.http.get<string>(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteNote(id: string) {
    const url = `${this.apiUrl}/note/${id}`;
    return this.http.delete<string>(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getCategories() {
    const url = `${this.apiUrl}/categories`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const categories = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            categories.push({ ...response[key], id: key });
          }
        }
        return categories;
      })
    );
  }

  getCategoryById(id: string) {
    const url = `${this.apiUrl}/category/${id}`;
    return this.http.get<string>(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getSubcategories() {
    const url = `${this.apiUrl}/subcategories`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const subcategories = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            subcategories.push({ ...response[key], id: key });
          }
        }
        return subcategories;
      })
    );
  }

  getSubCategoryById(id: string) {
    const url = `${this.apiUrl}/subcategory/${id}`;
    return this.http.get<string>(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getUsers() {
    const url = `${this.apiUrl}/users/`;
    return this.http.get<string>(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getUserById(id: string) {
    const url = `${this.apiUrl}/user/${id}`;
    return this.http.get<string>(url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllData() {
    return combineLatest([
      this.getNotes(),
      this.getCategories(),
      this.getSubcategories(),
      this.userService.getUsers(),
    ]).pipe(
      map(([notes, categories, subcategories, users]) => {
        return [notes, categories, subcategories, users];
      })
    );
  }

  getAllNoteData(): Observable<FinalNote[]> {
    let finalNotes: FinalNote[] = [];

    return combineLatest([
      this.getNotes(),
      this.getCategories(),
      this.getSubcategories(),
      this.userService.getUsers(),
    ]).pipe(
      map(([notes, categories, subcategories, users]) => {
        notes.forEach((note) => {
          const findCategory = categories.find(
            (category) => category._id === note.category_id
          );
          const findSubcategory = subcategories.find(
            (subcategory) => subcategory._id === note.subcategory_id
          );
          const findUser = users.find(
            (author) => author._id === note.author_id
          );

          if (findCategory) {
            const finalNote: FinalNote = {
              note_id: note._id,
              noteName: note.name,
              content: note.content,
              shared_date: note.shared_date,
              last_edit_date: note.last_edit_date,
              published: note.published,
              positive_reviews: note.positive_reviews,
              negative_reviews: note.negative_reviews,
              category_id: findCategory._id,
              categoryName: findCategory.name,
              subcategory_id: findSubcategory ? findSubcategory._id : '',
              subcategoryName: findSubcategory ? findSubcategory.name : '',
              author_id: findUser ? findUser._id : '',
              login: findUser ? findUser.login : '',
              avatar_url: findUser ? findUser.avatar_url : '',
              email: findUser ? findUser.email : '',
              password: findUser ? findUser.password : '',
              active: findUser ? findUser.active : false,
              created: findUser ? findUser.active : new Date(),
              role: findUser ? findUser.role : 'user',
              untrusted: findUser ? findUser.untrusted : false,
              saved_notes: findUser ? findUser.saved_notes : [],
              followed_users: findUser ? findUser.followed_users : [],
              blocked_users: findUser ? findUser.blocked_users : [],
            };

            finalNotes.push(finalNote);
          }
        });

        return finalNotes;
      })
    );
  }
}
