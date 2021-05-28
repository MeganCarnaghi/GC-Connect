import { TestBed } from '@angular/core/testing';

import { GcConnectService } from './gc-connect.service';

describe('GcConnectService', () => {
  let service: GcConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GcConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
