import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesModelComponent } from './notes-model.component';

describe('NotesContainerComponent', () => {
  let component: NotesModelComponent;
  let fixture: ComponentFixture<NotesModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesModelComponent],
    });
    fixture = TestBed.createComponent(NotesModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
