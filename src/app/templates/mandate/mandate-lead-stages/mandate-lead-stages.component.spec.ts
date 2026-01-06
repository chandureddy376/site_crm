import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateLeadStagesComponent } from './mandate-lead-stages.component';

describe('MandateLeadStagesComponent', () => {
  let component: MandateLeadStagesComponent;
  let fixture: ComponentFixture<MandateLeadStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateLeadStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateLeadStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
