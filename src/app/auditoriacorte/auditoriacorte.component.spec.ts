/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuditoriacorteComponent } from './auditoriacorte.component';

describe('AuditoriacorteComponent', () => {
  let component: AuditoriacorteComponent;
  let fixture: ComponentFixture<AuditoriacorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriacorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriacorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
