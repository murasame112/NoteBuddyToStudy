import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelMainComponent } from './admin-panel-main.component';

describe('AdminPanelMainComponent', () => {
  let component: AdminPanelMainComponent;
  let fixture: ComponentFixture<AdminPanelMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPanelMainComponent]
    });
    fixture = TestBed.createComponent(AdminPanelMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
