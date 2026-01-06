import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateAssignedLeadsComponent } from './mandate-assigned-leads.component';

describe('MandateAssignedLeadsComponent', () => {
  let component: MandateAssignedLeadsComponent;
  let fixture: ComponentFixture<MandateAssignedLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateAssignedLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateAssignedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
