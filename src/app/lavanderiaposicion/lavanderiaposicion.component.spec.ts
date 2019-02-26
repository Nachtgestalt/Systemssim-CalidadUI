/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LavanderiaposicionComponent } from './lavanderiaposicion.component';

describe('LavanderiaposicionComponent', () => {
  let component: LavanderiaposicionComponent;
  let fixture: ComponentFixture<LavanderiaposicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LavanderiaposicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LavanderiaposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
