/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlantasComponent } from './plantas.component';

describe('PlantasComponent', () => {
  let component: PlantasComponent;
  let fixture: ComponentFixture<PlantasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
