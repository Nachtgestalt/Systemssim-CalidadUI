/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProcesosespecialesdefectosComponent } from './procesosespecialesdefectos.component';

describe('ProcesosespecialesdefectosComponent', () => {
  let component: ProcesosespecialesdefectosComponent;
  let fixture: ComponentFixture<ProcesosespecialesdefectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesosespecialesdefectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosespecialesdefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
