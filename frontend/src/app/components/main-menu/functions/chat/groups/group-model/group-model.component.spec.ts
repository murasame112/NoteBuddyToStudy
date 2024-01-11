import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupModelComponent } from './group-model.component';

describe('GroupModelComponent', () => {
  let component: GroupModelComponent;
  let fixture: ComponentFixture<GroupModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupModelComponent]
    });
    fixture = TestBed.createComponent(GroupModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
