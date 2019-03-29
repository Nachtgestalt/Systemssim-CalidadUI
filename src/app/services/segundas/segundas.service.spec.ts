import { TestBed } from '@angular/core/testing';

import { SegundasService } from './segundas.service';

describe('SegundasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SegundasService = TestBed.get(SegundasService);
    expect(service).toBeTruthy();
  });
});
