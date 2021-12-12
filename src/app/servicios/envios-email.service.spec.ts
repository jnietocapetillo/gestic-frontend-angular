import { TestBed } from '@angular/core/testing';

import { EnviosEmailService } from './envios-email.service';

describe('EnviosEmailService', () => {
  let service: EnviosEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnviosEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
