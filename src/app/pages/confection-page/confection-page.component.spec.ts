import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfectionPageComponent } from './confection-page.component';

describe('ConfectionPageComponent', () => {
  let component: ConfectionPageComponent;
  let fixture: ComponentFixture<ConfectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfectionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
