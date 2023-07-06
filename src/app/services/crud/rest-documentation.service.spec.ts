import { TestBed } from '@angular/core/testing';

import { RestDocumentationService } from './rest-documentation.service';

describe('RestDocumentationService', () => {
  let service: RestDocumentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestDocumentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
