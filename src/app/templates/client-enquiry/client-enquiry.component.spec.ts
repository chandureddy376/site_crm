import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEnquiryComponent } from './client-enquiry.component';

describe('ClientEnquiryComponent', () => {
  let component: ClientEnquiryComponent;
  let fixture: ComponentFixture<ClientEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
