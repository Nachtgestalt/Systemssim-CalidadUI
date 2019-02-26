/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DefectocorteComponent } from './defectocorte.component';

describe('DefectocorteComponent', () => {
  let component: DefectocorteComponent;
  let fixture: ComponentFixture<DefectocorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectocorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectocorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
