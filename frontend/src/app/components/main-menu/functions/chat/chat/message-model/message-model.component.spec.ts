import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageModelComponent } from './message-model.component';

describe('MessageModelComponent', () => {
  let component: MessageModelComponent;
  let fixture: ComponentFixture<MessageModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageModelComponent]
    });
    fixture = TestBed.createComponent(MessageModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
