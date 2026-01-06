import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateFeedbackComponent } from './mandate-feedback.component';

describe('MandateFeedbackComponent', () => {
  let component: MandateFeedbackComponent;
  let fixture: ComponentFixture<MandateFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
