import { Component, OnInit,Input } from '@angular/core';
import { NotesService } from '../../../../../services/notes.service';



@Component({
  selector: 'app-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.scss']
})
export class NotesContainerComponent implements OnInit{

@Input() data:any



  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
  }

 getCategory(id:string)
 {
  // console.log(id);
  // this.notesService.getCategoryById(id);

 }
}
