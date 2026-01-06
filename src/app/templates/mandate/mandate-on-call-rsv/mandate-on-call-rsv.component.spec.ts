import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateOnCallRsvComponent } from './mandate-on-call-rsv.component';

describe('MandateOnCallRsvComponent', () => {
  let component: MandateOnCallRsvComponent;
  let fixture: ComponentFixture<MandateOnCallRsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateOnCallRsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateOnCallRsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
