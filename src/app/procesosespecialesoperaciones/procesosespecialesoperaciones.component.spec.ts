/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProcesosespecialesoperacionesComponent } from './procesosespecialesoperaciones.component';

describe('ProcesosespecialesoperacionesComponent', () => {
  let component: ProcesosespecialesoperacionesComponent;
  let fixture: ComponentFixture<ProcesosespecialesoperacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesosespecialesoperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosespecialesoperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
