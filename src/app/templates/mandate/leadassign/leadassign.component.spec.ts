import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadassignComponent } from './leadassign.component';

describe('LeadassignComponent', () => {
  let component: LeadassignComponent;
  let fixture: ComponentFixture<LeadassignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadassignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
