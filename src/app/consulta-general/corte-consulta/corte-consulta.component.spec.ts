import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CorteConsultaComponent} from './corte-consulta.component';

describe('CorteConsultaComponent', () => {
  let component: CorteConsultaComponent;
  let fixture: ComponentFixture<CorteConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorteConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
