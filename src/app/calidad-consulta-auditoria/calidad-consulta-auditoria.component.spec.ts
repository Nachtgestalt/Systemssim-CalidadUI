import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalidadConsultaAuditoriaComponent } from './calidad-consulta-auditoria.component';

describe('CalidadConsultaAuditoriaComponent', () => {
  let component: CalidadConsultaAuditoriaComponent;
  let fixture: ComponentFixture<CalidadConsultaAuditoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalidadConsultaAuditoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalidadConsultaAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
