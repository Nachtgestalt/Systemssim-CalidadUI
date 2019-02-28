import { TestBed } from '@angular/core/testing';

import { PosicionTerminadoService } from './posicion-terminado.service';

describe('PosicionTerminadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PosicionTerminadoService = TestBed.get(PosicionTerminadoService);
    expect(service).toBeTruthy();
  });
});
