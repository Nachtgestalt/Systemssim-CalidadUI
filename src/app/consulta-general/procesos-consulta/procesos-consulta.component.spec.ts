import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProcesosConsultaComponent} from './procesos-consulta.component';

describe('ProcesosConsultaComponent', () => {
  let component: ProcesosConsultaComponent;
  let fixture: ComponentFixture<ProcesosConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesosConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
