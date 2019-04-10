import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaProcesosConsultaComponent } from './auditoria-procesos-consulta.component';

describe('AuditoriaProcesosConsultaComponent', () => {
  let component: AuditoriaProcesosConsultaComponent;
  let fixture: ComponentFixture<AuditoriaProcesosConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaProcesosConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaProcesosConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
