import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminadoConsultaAuditoriaComponent } from './terminado-consulta-auditoria.component';

describe('TerminadoConsultaAuditoriaComponent', () => {
  let component: TerminadoConsultaAuditoriaComponent;
  let fixture: ComponentFixture<TerminadoConsultaAuditoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminadoConsultaAuditoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadoConsultaAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
