import { TestBed, inject } from '@angular/core/testing';

import { TerminadoService } from './terminado.service';

describe('TerminadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminadoService]
    });
  });

  it('should be created', inject([TerminadoService], (service: TerminadoService) => {
    expect(service).toBeTruthy();
  }));
});
