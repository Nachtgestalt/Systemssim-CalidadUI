/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LavanderiaoperacionesComponent } from './lavanderiaoperaciones.component';

describe('LavanderiaoperacionesComponent', () => {
  let component: LavanderiaoperacionesComponent;
  let fixture: ComponentFixture<LavanderiaoperacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LavanderiaoperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LavanderiaoperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
