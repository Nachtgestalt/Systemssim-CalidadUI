import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminadoPosicionComponent } from './terminado-posicion.component';

describe('TerminadoPosicionComponent', () => {
  let component: TerminadoPosicionComponent;
  let fixture: ComponentFixture<TerminadoPosicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminadoPosicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadoPosicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
