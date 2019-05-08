import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReporteConfeccionComponent} from './reporte-confeccion.component';

describe('ReporteConfeccionComponent', () => {
  let component: ReporteConfeccionComponent;
  let fixture: ComponentFixture<ReporteConfeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteConfeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteConfeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
