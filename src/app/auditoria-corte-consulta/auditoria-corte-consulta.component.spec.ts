import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AuditoriaCorteConsultaComponent} from './auditoria-corte-consulta.component';

describe('AuditoriaCorteConsultaComponent', () => {
  let component: AuditoriaCorteConsultaComponent;
  let fixture: ComponentFixture<AuditoriaCorteConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaCorteConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaCorteConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
