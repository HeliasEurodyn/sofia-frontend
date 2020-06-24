import { TestBed } from '@angular/core/testing';

import { NavigatorService } from './navigator.service';

describe('PageNavigatorService', () => {
  let service: NavigatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
