import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyReportListingComponent } from './hourly-report-listing.component';

describe('HourlyReportListingComponent', () => {
  let component: HourlyReportListingComponent;
  let fixture: ComponentFixture<HourlyReportListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyReportListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyReportListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
