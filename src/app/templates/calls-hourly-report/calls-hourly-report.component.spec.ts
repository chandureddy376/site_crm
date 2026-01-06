import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsHourlyReportComponent } from './calls-hourly-report.component';

describe('CallsHourlyReportComponent', () => {
  let component: CallsHourlyReportComponent;
  let fixture: ComponentFixture<CallsHourlyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsHourlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsHourlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
