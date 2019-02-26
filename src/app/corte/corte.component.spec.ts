/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CorteComponent } from './corte.component';

describe('CorteComponent', () => {
  let component: CorteComponent;
  let fixture: ComponentFixture<CorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
