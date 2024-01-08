import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatApiTestComponent } from './chat-api-test.component';

describe('ChatApiTestComponent', () => {
  let component: ChatApiTestComponent;
  let fixture: ComponentFixture<ChatApiTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatApiTestComponent]
    });
    fixture = TestBed.createComponent(ChatApiTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
