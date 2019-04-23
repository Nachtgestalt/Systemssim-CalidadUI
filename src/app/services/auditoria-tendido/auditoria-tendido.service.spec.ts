import {TestBed} from '@angular/core/testing';

import {AuditoriaTendidoService} from './auditoria-tendido.service';

describe('AuditoriaTendidoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditoriaTendidoService = TestBed.get(AuditoriaTendidoService);
    expect(service).toBeTruthy();
  });
});
