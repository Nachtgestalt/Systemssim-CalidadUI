import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaLavanderiaComponent } from './auditoria-lavanderia.component';

describe('AuditoriaLavanderiaComponent', () => {
  let component: AuditoriaLavanderiaComponent;
  let fixture: ComponentFixture<AuditoriaLavanderiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaLavanderiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaLavanderiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
