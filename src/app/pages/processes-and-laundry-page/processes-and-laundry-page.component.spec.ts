import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessesAndLaundryPageComponent } from './processes-and-laundry-page.component';

describe('ProcessesAndLaundryPageComponent', () => {
  let component: ProcessesAndLaundryPageComponent;
  let fixture: ComponentFixture<ProcessesAndLaundryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessesAndLaundryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessesAndLaundryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
