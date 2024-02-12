import { TestBed } from '@angular/core/testing';

import { IpapiServiceService } from './ipapi-service.service';

describe('IpapiServiceService', () => {
  let service: IpapiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpapiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
