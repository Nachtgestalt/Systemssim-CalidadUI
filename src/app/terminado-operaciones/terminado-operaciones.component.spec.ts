import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminadoOperacionesComponent } from './terminado-operaciones.component';

describe('TerminadoOperacionesComponent', () => {
  let component: TerminadoOperacionesComponent;
  let fixture: ComponentFixture<TerminadoOperacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminadoOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadoOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
