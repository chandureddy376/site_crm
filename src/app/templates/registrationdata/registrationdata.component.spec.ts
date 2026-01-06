import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationdataComponent } from './registrationdata.component';

describe('RegistrationdataComponent', () => {
  let component: RegistrationdataComponent;
  let fixture: ComponentFixture<RegistrationdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
