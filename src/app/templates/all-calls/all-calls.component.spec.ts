import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCallsComponent } from './all-calls.component';

describe('AllCallsComponent', () => {
  let component: AllCallsComponent;
  let fixture: ComponentFixture<AllCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
