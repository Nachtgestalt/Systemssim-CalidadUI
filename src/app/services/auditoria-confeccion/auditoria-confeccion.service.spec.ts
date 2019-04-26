import {TestBed} from '@angular/core/testing';

import {AuditoriaConfeccionService} from './auditoria-confeccion.service';

describe('AuditoriaConfeccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditoriaConfeccionService = TestBed.get(AuditoriaConfeccionService);
    expect(service).toBeTruthy();
  });
});
