import { Component, OnInit,Input, ViewChild, EventEmitter,Output } from '@angular/core';
import { NotesService } from '../../../../../services/notes.service';
import { Note } from 'src/app/models/note.model';
import { NoteAndDetails } from 'src/app/models/noteAndDetails.model';



@Component({
  selector: 'app-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.scss']
})
export class NotesContainerComponent implements OnInit{

  //TODO sortowanie po dacie
  //TODO tworzenie fiszek
  //TODO poprawki z layoucie (addNote) i subcategory box gdy wymagany jest długi temat
  //TODO addNote po dodaniu wraca do notes


 @Input() data:Note | null = null ;
 @Input() notesAndDetails:NoteAndDetails[] | null = null;
 @Output()  public deleteNoteEvent: EventEmitter<boolean> = new EventEmitter();


 isVisible:boolean=false;
 categoryName:string ="";
 subCategoryName:string = "";
 userName:string = "";
 untrustedUser:boolean = false;

 noteID:string = "";
 noteName:string = "";
 noteCategory:string ="";
 noteSubcategory:string="";
 author:string ="";

currentNoteDetails:NoteAndDetails = {
  noteID: this.noteID,
  noteName: this.noteName,
  categoryName: this.noteCategory,
  subcategoryName: this.noteSubcategory,
  author: this.author
};

  constructor(private notesService: NotesService ) {}

  ngOnInit(): void {
    if(this.data != null)
    {
      //TODO async all methods to load at the same time
      // this.getAllData(this.data.category_id,this.data.subcategory_id,this.data.author_id);
      // this.getCategory(this.data.category_id);
      // this.getSubCategory(this.data.subcategory_id);
      // this.getUser(this.data.author_id);
      // this.getDetails()
    }

  }

  getAllData(categoryID:any,subcategoryID:any,userID:any)
  {

      this.notesService.getAllDataById(categoryID.toString(),subcategoryID.toString(),userID.toString()).subscribe((res)=>{
        // console.log(res);
        this.categoryName = res[0].name;
        this.subCategoryName= res[1].name
        this.userName= res[2].login;
        this.untrustedUser = res[2].untrusted;

      })
  }

  getDetails()
  {
    if(this.data !=null && this.notesAndDetails != null)
    {

     console.log(this.notesAndDetails[0])

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
      this.userName= res.login;
      this.untrustedUser = res.untrusted;
    }).toString();
 }

 hoverEventOn()
 {
  this.isVisible= true;
 }

 hoverEventOff()
 {
  // let icons:any = document.querySelectorAll('.icons');
  this.isVisible= false;
}


 deleteNote(_id:any)
 {
  this.notesService.deleteNote(_id.toString()).subscribe((res)=>{
    this.deleteNoteEvent.emit();

  })
 }


}
