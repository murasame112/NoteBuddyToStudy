import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteNotesComponent } from './favorite-notes.component';

describe('FavoriteNotesComponent', () => {
  let component: FavoriteNotesComponent;
  let fixture: ComponentFixture<FavoriteNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteNotesComponent]
    });
    fixture = TestBed.createComponent(FavoriteNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
