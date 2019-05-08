import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LavanderiaConsultaComponent} from './lavanderia-consulta.component';

describe('LavanderiaConsultaComponent', () => {
  let component: LavanderiaConsultaComponent;
  let fixture: ComponentFixture<LavanderiaConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LavanderiaConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LavanderiaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
