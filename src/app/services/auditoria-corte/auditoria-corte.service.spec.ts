import {TestBed} from '@angular/core/testing';

import {AuditoriaCorteService} from './auditoria-corte.service';

describe('AuditoriaCorteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditoriaCorteService = TestBed.get(AuditoriaCorteService);
    expect(service).toBeTruthy();
  });
});
