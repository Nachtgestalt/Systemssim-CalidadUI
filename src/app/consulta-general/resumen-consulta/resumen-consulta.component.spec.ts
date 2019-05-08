import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResumenConsultaComponent} from './resumen-consulta.component';

describe('ResumenConsultaComponent', () => {
  let component: ResumenConsultaComponent;
  let fixture: ComponentFixture<ResumenConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
