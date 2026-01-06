import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpClientListingComponent } from './cp-client-listing.component';

describe('CpClientListingComponent', () => {
  let component: CpClientListingComponent;
  let fixture: ComponentFixture<CpClientListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpClientListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpClientListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
