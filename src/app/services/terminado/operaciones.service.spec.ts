import { TestBed, inject } from '@angular/core/testing';

import { OperacionesService } from './operaciones.service';

describe('OperacionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperacionesService]
    });
  });

  it('should be created', inject([OperacionesService], (service: OperacionesService) => {
    expect(service).toBeTruthy();
  }));
});
