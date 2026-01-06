import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateOnCallUsvComponent } from './mandate-on-call-usv.component';

describe('MandateOnCallUsvComponent', () => {
  let component: MandateOnCallUsvComponent;
  let fixture: ComponentFixture<MandateOnCallUsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateOnCallUsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateOnCallUsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
