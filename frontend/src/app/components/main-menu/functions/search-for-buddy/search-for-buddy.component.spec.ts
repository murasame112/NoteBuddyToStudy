import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForBuddyComponent } from './search-for-buddy.component';

describe('SearchForBuddyComponent', () => {
  let component: SearchForBuddyComponent;
  let fixture: ComponentFixture<SearchForBuddyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchForBuddyComponent]
    });
    fixture = TestBed.createComponent(SearchForBuddyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
