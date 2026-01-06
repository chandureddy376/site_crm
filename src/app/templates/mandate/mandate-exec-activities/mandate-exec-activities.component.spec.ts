import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateExecActivitiesComponent } from './mandate-exec-activities.component';

describe('MandateExecActivitiesComponent', () => {
  let component: MandateExecActivitiesComponent;
  let fixture: ComponentFixture<MandateExecActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateExecActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateExecActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
