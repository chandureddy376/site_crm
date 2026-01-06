import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatePriceListingComponent } from './mandate-price-listing.component';

describe('MandatePriceListingComponent', () => {
  let component: MandatePriceListingComponent;
  let fixture: ComponentFixture<MandatePriceListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatePriceListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatePriceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
