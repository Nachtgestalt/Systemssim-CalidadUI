import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminadoAudiotoriaDefectosComponent } from './terminado-audiotoria-defectos.component';

describe('TerminadoAudiotoriaDefectosComponent', () => {
  let component: TerminadoAudiotoriaDefectosComponent;
  let fixture: ComponentFixture<TerminadoAudiotoriaDefectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminadoAudiotoriaDefectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadoAudiotoriaDefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
