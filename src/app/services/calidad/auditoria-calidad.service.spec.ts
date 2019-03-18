import { TestBed } from '@angular/core/testing';

import { AuditoriaCalidadService } from './auditoria-calidad.service';

describe('AuditoriaCalidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditoriaCalidadService = TestBed.get(AuditoriaCalidadService);
    expect(service).toBeTruthy();
  });
});
