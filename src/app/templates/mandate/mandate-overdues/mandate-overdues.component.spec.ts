import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateOverduesComponent } from './mandate-overdues.component';

describe('MandateOverduesComponent', () => {
  let component: MandateOverduesComponent;
  let fixture: ComponentFixture<MandateOverduesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateOverduesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateOverduesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
