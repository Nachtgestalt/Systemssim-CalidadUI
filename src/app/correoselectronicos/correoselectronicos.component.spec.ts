/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CorreoselectronicosComponent } from './correoselectronicos.component';

describe('CorreoselectronicosComponent', () => {
  let component: CorreoselectronicosComponent;
  let fixture: ComponentFixture<CorreoselectronicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorreoselectronicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorreoselectronicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
