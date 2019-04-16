import {TestBed} from '@angular/core/testing';

import {CorteService} from './corte.service';

describe('CorteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorteService = TestBed.get(CorteService);
    expect(service).toBeTruthy();
  });
});
