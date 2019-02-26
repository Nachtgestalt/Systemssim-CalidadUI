/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LavanderiadefectosComponent } from './lavanderiadefectos.component';

describe('LavanderiadefectosComponent', () => {
  let component: LavanderiadefectosComponent;
  let fixture: ComponentFixture<LavanderiadefectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LavanderiadefectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LavanderiadefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
