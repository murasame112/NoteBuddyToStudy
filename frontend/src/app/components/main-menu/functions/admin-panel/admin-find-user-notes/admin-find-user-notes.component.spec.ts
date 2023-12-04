import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFindUserNotesComponent } from './admin-find-user-notes.component';

describe('AdminFindUserNotesComponent', () => {
  let component: AdminFindUserNotesComponent;
  let fixture: ComponentFixture<AdminFindUserNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFindUserNotesComponent]
    });
    fixture = TestBed.createComponent(AdminFindUserNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
