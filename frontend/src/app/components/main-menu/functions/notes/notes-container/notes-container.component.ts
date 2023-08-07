import { Component, OnInit,Input } from '@angular/core';
import { NotesService } from '../../../../../services/notes.service';
import { Note } from 'src/app/models/note.model';



@Component({
  selector: 'app-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.scss']
})
export class NotesContainerComponent implements OnInit{

@Input() data:Note | null = null ;
categoryName:string ="";
subCategoryName:string = "";
userName:string = "";


  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    if(this.data != null)
    {
      console.log(this.data.category_id);
      this.getCategory(this.data.category_id);
      this.getSubCategory(this.data.subcategory_id);
      this.getUser(this.data.author_id);
    }
  }

 getCategory(id:Object)
 {
 this.notesService.getCategoryById(id.toString()).subscribe
 ((res)=>{
  // console.log(res)
  this.categoryName = res.name;
 }).toString();

 }

 getSubCategory(id:Object)
 {
  this.notesService.getSubCategoryById(id.toString()).subscribe
  (
    (res)=>{
      this.subCategoryName= res.name
    }).toString();
 }

 getUser(id:Object)
 {
  this.notesService.getUserById(id.toString()).subscribe
  (
    (res)=>{
      this.userName= res.name

    }).toString();
 }

}
