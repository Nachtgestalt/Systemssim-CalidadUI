import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TerminadoConsultaComponent} from './terminado-consulta.component';

describe('TerminadoConsultaComponent', () => {
  let component: TerminadoConsultaComponent;
  let fixture: ComponentFixture<TerminadoConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminadoConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadoConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
