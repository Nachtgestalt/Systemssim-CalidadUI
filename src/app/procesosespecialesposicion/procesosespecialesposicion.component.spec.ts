/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProcesosespecialesposicionComponent } from './procesosespecialesposicion.component';

describe('ProcesosespecialesposicionComponent', () => {
  let component: ProcesosespecialesposicionComponent;
  let fixture: ComponentFixture<ProcesosespecialesposicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesosespecialesposicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosespecialesposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
