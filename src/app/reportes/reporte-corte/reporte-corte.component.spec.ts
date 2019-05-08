import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReporteCorteComponent} from './reporte-corte.component';

describe('ReporteCorteComponent', () => {
  let component: ReporteCorteComponent;
  let fixture: ComponentFixture<ReporteCorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteCorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
