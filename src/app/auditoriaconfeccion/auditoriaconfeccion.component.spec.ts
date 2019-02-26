/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditoriaconfeccionComponent } from './auditoriaconfeccion.component';

describe('AuditoriaconfeccionComponent', () => {
  let component: AuditoriaconfeccionComponent;
  let fixture: ComponentFixture<AuditoriaconfeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaconfeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaconfeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
