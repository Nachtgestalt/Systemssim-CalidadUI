/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TendidoComponent } from './tendido.component';

describe('TendidoComponent', () => {
  let component: TendidoComponent;
  let fixture: ComponentFixture<TendidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TendidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TendidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
