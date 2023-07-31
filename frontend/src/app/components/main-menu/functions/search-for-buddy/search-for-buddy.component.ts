import { Component,OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Category } from 'src/app/enums/category';

@Component({
  selector: 'app-search-for-buddy',
  templateUrl: './search-for-buddy.component.html',
  styleUrls: ['./search-for-buddy.component.scss']
})
export class SearchForBuddyComponent implements OnInit{



  constructor() {}

  category = Object.values(Category);


  ngOnInit(): void {
    this.searchBuddyForm = new FormGroup(
      {
        noteName: new FormControl('' ,Validators.required)  ,
        noteDesc: new FormControl('' ,Validators.required),
        courseName: new FormControl('' ,Validators.required),
      });
  }

  searchBuddyForm = new FormGroup(
    {
      noteName: new FormControl('' ,Validators.required)  ,
      noteDesc: new FormControl('' ,Validators.required),
      courseName: new FormControl('' ,Validators.required),

    });


    searchBuddy(data:any)
    {

    }


}
