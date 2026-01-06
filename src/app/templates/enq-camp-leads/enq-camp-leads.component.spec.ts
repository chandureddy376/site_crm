import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqCampLeadsComponent } from './enq-camp-leads.component';

describe('EnqCampLeadsComponent', () => {
  let component: EnqCampLeadsComponent;
  let fixture: ComponentFixture<EnqCampLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnqCampLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnqCampLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
