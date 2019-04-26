import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AuditoriaConfeccionConsultaComponent} from './auditoria-confeccion-consulta.component';

describe('AuditoriaConfeccionConsultaComponent', () => {
  let component: AuditoriaConfeccionConsultaComponent;
  let fixture: ComponentFixture<AuditoriaConfeccionConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaConfeccionConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaConfeccionConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
