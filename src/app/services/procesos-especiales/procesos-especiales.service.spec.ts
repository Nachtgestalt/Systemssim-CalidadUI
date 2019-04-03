import { TestBed } from '@angular/core/testing';

import { ProcesosEspecialesService } from './procesos-especiales.service';

describe('ProcesosEspecialesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcesosEspecialesService = TestBed.get(ProcesosEspecialesService);
    expect(service).toBeTruthy();
  });
});
