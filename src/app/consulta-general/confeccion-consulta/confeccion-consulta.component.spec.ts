import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfeccionConsultaComponent} from './confeccion-consulta.component';

describe('ConfeccionConsultaComponent', () => {
  let component: ConfeccionConsultaComponent;
  let fixture: ComponentFixture<ConfeccionConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfeccionConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfeccionConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
