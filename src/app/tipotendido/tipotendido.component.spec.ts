/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TipotendidoComponent } from './tipotendido.component';

describe('TipotendidoComponent', () => {
  let component: TipotendidoComponent;
  let fixture: ComponentFixture<TipotendidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipotendidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipotendidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
