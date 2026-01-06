import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCallsListingComponent } from './all-calls-listing.component';

describe('AllCallsListingComponent', () => {
  let component: AllCallsListingComponent;
  let fixture: ComponentFixture<AllCallsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCallsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCallsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
