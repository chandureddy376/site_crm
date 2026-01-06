import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateOnCallClosedComponent } from './mandate-on-call-closed.component';

describe('MandateOnCallClosedComponent', () => {
  let component: MandateOnCallClosedComponent;
  let fixture: ComponentFixture<MandateOnCallClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateOnCallClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateOnCallClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
