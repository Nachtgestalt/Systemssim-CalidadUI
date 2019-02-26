/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SegundasComponent } from './segundas.component';

describe('SegundasComponent', () => {
  let component: SegundasComponent;
  let fixture: ComponentFixture<SegundasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegundasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegundasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
