import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaLavanderiaConsultaComponent } from './auditoria-lavanderia-consulta.component';

describe('AuditoriaLavanderiaConsultaComponent', () => {
  let component: AuditoriaLavanderiaConsultaComponent;
  let fixture: ComponentFixture<AuditoriaLavanderiaConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaLavanderiaConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaLavanderiaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
