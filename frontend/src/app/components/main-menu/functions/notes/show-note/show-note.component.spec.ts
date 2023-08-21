import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNoteComponent } from './show-note.component';

describe('ShowNoteComponent', () => {
  let component: ShowNoteComponent;
  let fixture: ComponentFixture<ShowNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowNoteComponent]
    });
    fixture = TestBed.createComponent(ShowNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
