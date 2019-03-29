import { TestBed } from '@angular/core/testing';

import { LavanderiaService } from './lavanderia.service';

describe('LavanderiaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LavanderiaService = TestBed.get(LavanderiaService);
    expect(service).toBeTruthy();
  });
});
