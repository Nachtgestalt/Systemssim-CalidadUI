import {TestBed} from '@angular/core/testing';

import {ConfeccionService} from './confeccion.service';

describe('ConfeccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfeccionService = TestBed.get(ConfeccionService);
    expect(service).toBeTruthy();
  });
});
