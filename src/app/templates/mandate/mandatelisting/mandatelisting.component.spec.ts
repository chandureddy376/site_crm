import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatelistingComponent } from './mandatelisting.component';

describe('MandatelistingComponent', () => {
  let component: MandatelistingComponent;
  let fixture: ComponentFixture<MandatelistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatelistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatelistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
