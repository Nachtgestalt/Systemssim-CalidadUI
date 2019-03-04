import { TestBed } from '@angular/core/testing';

import { AuditoriaTerminadoService } from './auditoria-terminado.service';

describe('AuditoriaTerminadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditoriaTerminadoService = TestBed.get(AuditoriaTerminadoService);
    expect(service).toBeTruthy();
  });
});
