import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsMonthlyReportComponent } from './calls-monthly-report.component';

describe('CallsMonthlyReportComponent', () => {
  let component: CallsMonthlyReportComponent;
  let fixture: ComponentFixture<CallsMonthlyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsMonthlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
