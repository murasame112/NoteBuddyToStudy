import { Injectable } from '@angular/core';
import {Observable, combineLatest, forkJoin} from 'rxjs';
import { Note } from '../models/note.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { UsersService } from './users.service';
import { NoteAndDetails } from '../models/noteAndDetails.model';


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  public apiUrl = 'http://localhost:3000';

  constructor(private http:HttpClient, private  userService:UsersService) { }


  addNote(note:Note):Observable<any>
  {

    const url = `${this.apiUrl}/note`;
    return this.http.post(url,note);
  }

  getNotes()
  {
    const url = `${this.apiUrl}/notes`;
    return this.http.get(url)
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
    ));

  }

  getNoteById(id:string)
  {
    const url =`${this.apiUrl}/note/${id}`
    return this.http.get<string>(url)
    .pipe(
      map((response:any)=>{

        return response;
      })

    )
  }


  deleteNote(id:string)
{

  const url =`${this.apiUrl}/note/${id}`
  return this.http.delete<string>(url)
  .pipe(
    map((response:any)=>{

      return response;
    })

  )

}


  getCategories()
  {
    const url = `${this.apiUrl}/categories`;
    return this.http.get(url)
    .pipe(map((response:any)=>
    {
      const categories = [];
      for(const key in response)
      {

        if(response.hasOwnProperty(key))
        {
          categories.push({...response[key], id: key})
        }

      }
      return categories;
    }
    ));
  }

  getCategoryById(id:string)
  {

    const url =`${this.apiUrl}/category/${id}`
    return this.http.get<string>(url)
    .pipe(
      map((response:any)=>{

        return response;
      })

    )
  }


  getSubcategories()
  {
    const url = `${this.apiUrl}/subcategories`;
    return this.http.get(url)
    .pipe(map((response:any)=>
    {
      const subcategories = [];
      for(const key in response)
      {

        if(response.hasOwnProperty(key))
        {
          subcategories.push({...response[key], id: key})
        }

      }
      return subcategories;
    }
    ));
  }


  getSubCategoryById(id:string)
  {
    const url =`${this.apiUrl}/subcategory/${id}`
    return this.http.get<string>(url)
    .pipe(
      map((response:any)=>{

        return response;
      })

    )
  }


  getUsers()
  {
    const url =`${this.apiUrl}/users/`
    return this.http.get<string>(url)
    .pipe(
      map((response:any)=>{

        return response;
      })

    )
  }

  getUserById(id:string)
  {
    const url =`${this.apiUrl}/user/${id}`
    return this.http.get<string>(url)
    .pipe(
      map((response:any)=>{

        return response;
      })

    )
  }



  getAllData()
  {
    return combineLatest([
      this.getNotes(),
      this.getCategories(),
      this.getSubcategories(),
      this.userService.getUsers(),
    ])
    .pipe(
      map(([notes,categories,subcategories,users])=>{
         return [notes,categories,subcategories,users];
        }))
  }

  getAllDataById(categoryID:string,subcategoryID:string,userID:string)
  {
    // return combineLatest([
    //   this.getCategoryById(categoryID),
    //   this.getSubCategoryById(subcategoryID),
    //   this.userService.getUserById(userID)
    // ])
    // .pipe(
    //   map(([category,subcategory,user])=>{
    //     return [category,subcategory,user]
    //   })
    // )

      return forkJoin([
        this.getCategoryById(categoryID),
      this.getSubCategoryById(subcategoryID),
      this.userService.getUserById(userID)
      ]).pipe(
        map(([category,subcategory,user])=>{
          return [category,subcategory,user]
        })
      )

  }

  mergeNotesAndDetails(noteID:string,noteName:string,noteCategory:string,noteSubcategory:string,author:string)
  {
    let noteWithDetails:NoteAndDetails=
   {
    noteID: noteID,
    noteName: noteName,
    categoryName: noteCategory,
    subcategoryName: noteSubcategory,
    author: author
   }
    return noteWithDetails;
  }

}
