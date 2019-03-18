import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalidadAuditoriaComponent } from './calidad-auditoria.component';

describe('CalidadAuditoriaComponent', () => {
  let component: CalidadAuditoriaComponent;
  let fixture: ComponentFixture<CalidadAuditoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalidadAuditoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalidadAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
