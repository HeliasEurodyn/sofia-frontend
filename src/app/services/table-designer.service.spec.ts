import { TestBed } from '@angular/core/testing';

import { TableDesignerService } from './table-designer.service';

describe('TableDesignerService', () => {
  let service: TableDesignerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableDesignerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
