import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsExecutivesReportComponent } from './calls-executives-report.component';

describe('CallsExecutivesReportComponent', () => {
  let component: CallsExecutivesReportComponent;
  let fixture: ComponentFixture<CallsExecutivesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsExecutivesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsExecutivesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
