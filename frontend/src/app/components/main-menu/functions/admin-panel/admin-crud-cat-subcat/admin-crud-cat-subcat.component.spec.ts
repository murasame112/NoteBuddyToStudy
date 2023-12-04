import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCrudCatSubcatComponent } from './admin-crud-cat-subcat.component';

describe('AdminCrudCatSubcatComponent', () => {
  let component: AdminCrudCatSubcatComponent;
  let fixture: ComponentFixture<AdminCrudCatSubcatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCrudCatSubcatComponent]
    });
    fixture = TestBed.createComponent(AdminCrudCatSubcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
