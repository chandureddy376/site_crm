import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateCustomerDetailsComponent } from './mandate-customer-details.component';

describe('MandateCustomerDetailsComponent', () => {
  let component: MandateCustomerDetailsComponent;
  let fixture: ComponentFixture<MandateCustomerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateCustomerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
