/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditoriatendidoComponent } from './auditoriatendido.component';

describe('AuditoriatendidoComponent', () => {
  let component: AuditoriatendidoComponent;
  let fixture: ComponentFixture<AuditoriatendidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriatendidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriatendidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
