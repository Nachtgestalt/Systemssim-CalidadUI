/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PosicioncorteComponent } from './posicioncorte.component';

describe('PosicioncorteComponent', () => {
  let component: PosicioncorteComponent;
  let fixture: ComponentFixture<PosicioncorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosicioncorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosicioncorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
