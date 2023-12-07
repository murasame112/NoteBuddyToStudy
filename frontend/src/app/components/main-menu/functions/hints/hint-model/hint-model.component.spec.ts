import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintModelComponent } from './hint-model.component';

describe('HintModelComponent', () => {
  let component: HintModelComponent;
  let fixture: ComponentFixture<HintModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HintModelComponent]
    });
    fixture = TestBed.createComponent(HintModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
