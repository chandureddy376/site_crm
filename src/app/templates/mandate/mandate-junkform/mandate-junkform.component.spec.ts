import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateJunkformComponent } from './mandate-junkform.component';

describe('JunkformComponent', () => {
  let component: MandateJunkformComponent;
  let fixture: ComponentFixture<MandateJunkformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateJunkformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateJunkformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
