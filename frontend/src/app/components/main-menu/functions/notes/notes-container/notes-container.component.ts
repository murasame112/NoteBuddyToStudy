import { Component, OnInit,Input, ViewChild, EventEmitter,Output } from '@angular/core';
import { NotesService } from '../../../../../services/notes.service';
import { Note } from 'src/app/models/note.model';



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
 @Output()  public deleteNoteEvent: EventEmitter<boolean> = new EventEmitter();


 isVisible:boolean=false;
 categoryName:string ="";
 subCategoryName:string = "";
 userName:string = "";
 untrustedUser:boolean = false;


  constructor(private notesService: NotesService ) {}

  ngOnInit(): void {
    if(this.data != null)
    {
      //TODO async all methods to load at the same time
      // console.log(this.data.category_id);
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
  let icons:any = document.querySelectorAll('.icons');
  this.isVisible= false;

 }


 deleteNote(_id:any)
 {
  this.notesService.deleteNote(_id.toString()).subscribe((res)=>{
    this.deleteNoteEvent.emit();

  })


 }


}
