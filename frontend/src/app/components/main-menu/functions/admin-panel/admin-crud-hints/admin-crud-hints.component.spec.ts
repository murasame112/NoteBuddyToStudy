import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCrudHintsComponent } from './admin-crud-hints.component';

describe('AdminCrudHintsComponent', () => {
  let component: AdminCrudHintsComponent;
  let fixture: ComponentFixture<AdminCrudHintsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCrudHintsComponent]
    });
    fixture = TestBed.createComponent(AdminCrudHintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
