import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminadoOrigenComponent } from './terminado-origen.component';

describe('TerminadoOrigenComponent', () => {
  let component: TerminadoOrigenComponent;
  let fixture: ComponentFixture<TerminadoOrigenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminadoOrigenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadoOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
