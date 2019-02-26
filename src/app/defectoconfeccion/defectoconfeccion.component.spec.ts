/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DefectoconfeccionComponent } from './defectoconfeccion.component';

describe('DefectoconfeccionComponent', () => {
  let component: DefectoconfeccionComponent;
  let fixture: ComponentFixture<DefectoconfeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectoconfeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectoconfeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
