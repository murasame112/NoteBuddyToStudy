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

  changeToAnswer() {
    let answerContainer: HTMLElement | null =
      document.querySelector('#questionContainer');

    let questionContainer: HTMLElement | null =
      document.querySelector('#answerContainer');

    if (answerContainer && questionContainer) {
      answerContainer.style.display = 'none';
      questionContainer.style.display = 'flex';
    }
  }

  changeToQuestion() {
    let questionContainer: HTMLElement | null =
      document.querySelector('#answerContainer');
    let answerContainer: HTMLElement | null =
      document.querySelector('#questionContainer');

    if (questionContainer && answerContainer) {
      questionContainer.style.display = 'none';
      answerContainer.style.display = 'flex';
    }
  }
}
