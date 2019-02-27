import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOperacionTerminadoComponent } from './add-edit-operacion-terminado.component';

describe('AddEditOperacionTerminadoComponent', () => {
  let component: AddEditOperacionTerminadoComponent;
  let fixture: ComponentFixture<AddEditOperacionTerminadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditOperacionTerminadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOperacionTerminadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
