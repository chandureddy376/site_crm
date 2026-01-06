import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateUsvformComponent } from './mandate-usvform.component';

describe('MandateUsvformComponent', () => {
  let component: MandateUsvformComponent;
  let fixture: ComponentFixture<MandateUsvformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateUsvformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateUsvformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
