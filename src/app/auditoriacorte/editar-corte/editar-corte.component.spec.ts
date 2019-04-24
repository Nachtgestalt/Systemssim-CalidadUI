import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditarCorteComponent} from './editar-corte.component';

describe('EditarCorteComponent', () => {
  let component: EditarCorteComponent;
  let fixture: ComponentFixture<EditarCorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
