import { Component, Input } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { CardsToShow } from 'src/app/models/cardToShow.model';

@Component({
  selector: 'app-card-model',
  templateUrl: './card-model.component.html',
  styleUrls: ['./card-model.component.scss'],
})
export class CardModelComponent {
  @Input() cardContent: CardsToShow | null = null;
  @Input() myCardContent: Card | null = null;
  questionVisible: boolean = true;

  toggleCard() {
    this.questionVisible = !this.questionVisible;
  }
}
