import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateRsvformComponent } from './mandate-rsvform.component';

describe('MandateRsvformComponent', () => {
  let component: MandateRsvformComponent;
  let fixture: ComponentFixture<MandateRsvformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateRsvformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateRsvformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
