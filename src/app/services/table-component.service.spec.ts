import { TestBed } from '@angular/core/testing';

import { TableComponentService } from './table-component.service';

describe('TableComponentService', () => {
  let service: TableComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
