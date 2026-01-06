import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateFollowupformComponent } from './mandate-followupform.component';

describe('FollowupformComponent', () => {
  let component: MandateFollowupformComponent;
  let fixture: ComponentFixture<MandateFollowupformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateFollowupformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateFollowupformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
