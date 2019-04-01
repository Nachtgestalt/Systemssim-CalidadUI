import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaClienteComponent } from './marca-cliente.component';

describe('MarcaClienteComponent', () => {
  let component: MarcaClienteComponent;
  let fixture: ComponentFixture<MarcaClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcaClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
