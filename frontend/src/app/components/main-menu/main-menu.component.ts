import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import Quill from 'quill';


@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
 ngOnInit(): void {
 }

 quillContent:FormControl<string | number | null>= new FormControl(null);


 quillConfig = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
  ],


}

editorStyle = {
  height: '5rem',
  backgroundColor: '#ffffff',
  border:'none'
}




}
