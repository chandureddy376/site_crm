import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceReportComponent } from './source-report.component';

describe('SourceReportComponent', () => {
  let component: SourceReportComponent;
  let fixture: ComponentFixture<SourceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
