import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditarTendidoComponent} from './editar-tendido.component';

describe('EditarTendidoComponent', () => {
  let component: EditarTendidoComponent;
  let fixture: ComponentFixture<EditarTendidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarTendidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTendidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
