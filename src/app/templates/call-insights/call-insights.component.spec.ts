import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallInsightsComponent } from './call-insights.component';

describe('CallInsightsComponent', () => {
  let component: CallInsightsComponent;
  let fixture: ComponentFixture<CallInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
