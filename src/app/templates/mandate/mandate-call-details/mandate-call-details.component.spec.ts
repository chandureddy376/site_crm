import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateCallDetailsComponent } from './mandate-call-details.component';

describe('MandateCallDetailsComponent', () => {
  let component: MandateCallDetailsComponent;
  let fixture: ComponentFixture<MandateCallDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateCallDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateCallDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
