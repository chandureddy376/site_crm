import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsIvrsComponent } from './calls-ivrs.component';

describe('CallsIvrsComponent', () => {
  let component: CallsIvrsComponent;
  let fixture: ComponentFixture<CallsIvrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsIvrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsIvrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
