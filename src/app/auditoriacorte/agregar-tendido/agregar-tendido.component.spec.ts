import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AgregarTendidoComponent} from './agregar-tendido.component';

describe('AgregarTendidoComponent', () => {
  let component: AgregarTendidoComponent;
  let fixture: ComponentFixture<AgregarTendidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarTendidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarTendidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
