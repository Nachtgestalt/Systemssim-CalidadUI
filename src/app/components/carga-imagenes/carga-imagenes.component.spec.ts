import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaImagenesComponent } from './carga-imagenes.component';

describe('CargaImagenesComponent', () => {
  let component: CargaImagenesComponent;
  let fixture: ComponentFixture<CargaImagenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaImagenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
