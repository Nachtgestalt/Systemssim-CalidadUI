import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AuditoriaTendidoConsultaComponent} from './auditoria-tendido-consulta.component';

describe('AuditoriaTendidoConsultaComponent', () => {
  let component: AuditoriaTendidoConsultaComponent;
  let fixture: ComponentFixture<AuditoriaTendidoConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaTendidoConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaTendidoConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
