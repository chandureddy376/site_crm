import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateOnCallFollowupformComponent } from './mandate-on-call-followupform.component';

describe('MandateOnCallFollowupformComponent', () => {
  let component: MandateOnCallFollowupformComponent;
  let fixture: ComponentFixture<MandateOnCallFollowupformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateOnCallFollowupformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateOnCallFollowupformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
