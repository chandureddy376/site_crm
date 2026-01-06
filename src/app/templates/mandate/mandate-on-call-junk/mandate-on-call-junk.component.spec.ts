import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateOnCallJunkComponent } from './mandate-on-call-junk.component';

describe('MandateOnCallJunkComponent', () => {
  let component: MandateOnCallJunkComponent;
  let fixture: ComponentFixture<MandateOnCallJunkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateOnCallJunkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateOnCallJunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
