import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateOnCallNegoComponent } from './mandate-on-call-nego.component';

describe('MandateOnCallNegoComponent', () => {
  let component: MandateOnCallNegoComponent;
  let fixture: ComponentFixture<MandateOnCallNegoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateOnCallNegoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateOnCallNegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
