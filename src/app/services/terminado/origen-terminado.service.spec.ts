import { TestBed } from '@angular/core/testing';

import { OrigenTerminadoService } from './origen-terminado.service';

describe('OrigenTerminadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrigenTerminadoService = TestBed.get(OrigenTerminadoService);
    expect(service).toBeTruthy();
  });
});
