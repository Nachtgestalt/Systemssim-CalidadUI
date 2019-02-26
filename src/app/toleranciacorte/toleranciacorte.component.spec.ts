/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ToleranciacorteComponent } from './toleranciacorte.component';

describe('ToleranciacorteComponent', () => {
  let component: ToleranciacorteComponent;
  let fixture: ComponentFixture<ToleranciacorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToleranciacorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToleranciacorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
