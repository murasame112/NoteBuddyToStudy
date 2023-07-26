import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss']
})
export class CardAddComponent implements OnInit{


constructor() {


}

  ngOnInit(): void {
    this.addCardForm = new FormGroup(
      {
        cardText: new FormControl('' ,Validators.required)  ,
        cardAnswer: new FormControl('' ,Validators.required),
      });
  }

  addCardForm = new FormGroup(
    {
      cardText: new FormControl('' ,Validators.required)  ,
      cardAnswer: new FormControl('' ,Validators.required),
    });


    addCard(data:any)
    {
      console.log(data.value);
    }
}
