/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditoriaprocesosespecialesComponent } from './auditoriaprocesosespeciales.component';

describe('AuditoriaprocesosespecialesComponent', () => {
  let component: AuditoriaprocesosespecialesComponent;
  let fixture: ComponentFixture<AuditoriaprocesosespecialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaprocesosespecialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaprocesosespecialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
