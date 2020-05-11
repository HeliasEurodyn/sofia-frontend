import { TestBed } from '@angular/core/testing';

import { MenuDesignerService } from './menu-designer.service';

describe('MenuDesignerService', () => {
  let service: MenuDesignerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuDesignerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
