import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AgregarCorteComponent} from './agregar-corte.component';

describe('AgregarCorteComponent', () => {
  let component: AgregarCorteComponent;
  let fixture: ComponentFixture<AgregarCorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarCorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
