/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TerminadodefectosComponent } from './terminadodefectos.component';

describe('TerminadodefectosComponent', () => {
  let component: TerminadodefectosComponent;
  let fixture: ComponentFixture<TerminadodefectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminadodefectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadodefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
