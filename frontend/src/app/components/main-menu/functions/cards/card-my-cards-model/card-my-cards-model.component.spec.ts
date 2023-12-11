import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMyCardsModelComponent } from './card-my-cards-model.component';

describe('CardMyCardsModelComponent', () => {
  let component: CardMyCardsModelComponent;
  let fixture: ComponentFixture<CardMyCardsModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardMyCardsModelComponent]
    });
    fixture = TestBed.createComponent(CardMyCardsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
