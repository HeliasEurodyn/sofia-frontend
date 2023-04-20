import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlTemplatePreviewComponent } from './html-template-preview.component';

describe('HtmlTemplatePreviewComponent', () => {
  let component: HtmlTemplatePreviewComponent;
  let fixture: ComponentFixture<HtmlTemplatePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlTemplatePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
