/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AreaconfeccionComponent } from './areaconfeccion.component';

describe('AreaconfeccionComponent', () => {
  let component: AreaconfeccionComponent;
  let fixture: ComponentFixture<AreaconfeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaconfeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaconfeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
