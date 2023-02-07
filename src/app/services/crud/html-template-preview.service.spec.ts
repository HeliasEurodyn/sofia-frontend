import { TestBed } from '@angular/core/testing';

import { HtmlTemplatePreviewService } from './html-template-preview.service';

describe('HtmlTemplatePreviewService', () => {
  let service: HtmlTemplatePreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlTemplatePreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
