import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReporteTerminadoComponent} from './reporte-terminado.component';

describe('ReporteTerminadoComponent', () => {
  let component: ReporteTerminadoComponent;
  let fixture: ComponentFixture<ReporteTerminadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteTerminadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTerminadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
